using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository,IMapper mapper, IPhotoService photoService)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _photoService = photoService;
        }
        

    [HttpGet]
    public  async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers( [FromQuery] UserParams  userParams)
    {
         
           var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
           userParams.CurrentUsername = user.UserName;

           if(string.IsNullOrEmpty(userParams.Gender))
               userParams.Gender = user.Gender  == "male" ? "female" : "male";

          var users =  await _userRepository.GetMembersAsync(userParams);
          Response.AddPaginationHeader(users.CurrentPage,users.PageSize,
              users.TotalCount, users.TotalPages);

           return Ok(users);
       
            
    }



//api/users/{id}
   
    [HttpGet("{username}" ,Name ="GetUser")]
    public async Task<ActionResult<MemberDto>> GetUser(string  username)
    {
        
        return await _userRepository.GetMemberAsync(username);
               
    }



    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var username =User.GetUsername();
        var user = await _userRepository.GetUserByUsernameAsync(username);
        _mapper.Map(memberUpdateDto,user);
        _userRepository.Update(user);

        if(await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to Update user");
    }




    [HttpPost("add-photo")]
     public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
     {
          var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

          var result = await _photoService.AddPhotoAsync(file);

          if(result.Error != null) return BadRequest(result.Error.Message);

          var Photo = new Photo
          {  
               Url = result.SecureUrl.AbsoluteUri,
               PublicId = result.PublicId

          };

          if(user.Photos.Count == 0)
          {
              Photo.IsMain = true;
          }

          user.Photos.Add(Photo);
          if(await _userRepository.SaveAllAsync()) 
          {
             // return _mapper.Map<PhotoDto>(Photo);
              return CreatedAtRoute("GetUser",new {Username = user.UserName}, _mapper.Map<PhotoDto>(Photo));
          }
               

        return BadRequest("problem adding photo");
          
     }



       [HttpPut("set-main-photo/{photoId}")]
       public async Task<ActionResult> SetMainPhoto(int photoId)
       {
           var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

           var photo = user.Photos.FirstOrDefault(x=> x.Id == photoId);
           if(photo.IsMain) return BadRequest("This is already your main photo");

           var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
           if(currentMain != null) currentMain.IsMain = false;

           photo.IsMain = true;

           if(await _userRepository.SaveAllAsync()) return NoContent();
           
           return BadRequest("Failed to set main photo");
       }




       [HttpDelete("delete-photo/{photoId}")]
       public async Task<ActionResult> Deletephoto(int photoId)
       {
           var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

           var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

           if(photo == null)  return NotFound();
           if(photo.IsMain) return BadRequest("You cannot delete your main photo");

           if(photo.PublicId != null)
           {
              var result =   await _photoService.DeletePhotoAsync(photo.PublicId);
              if(result.Error != null) return BadRequest(result.Error.Message);
           }


           user.Photos.Remove(photo);
           

           if(await _userRepository.SaveAllAsync()) return Ok();

           return BadRequest("faild to delete");


       }


    }
}