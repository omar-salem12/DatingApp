import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
 member : Member;
 



  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
   
    this.loadMember();

    
    

   
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for(const photo of this.member.photos)
    {

      imageUrls.push({
        samll: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })

      return imageUrls;
    }
  }


  loadMember() {
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {
        this.member = member;

       
    })
  }
 }
