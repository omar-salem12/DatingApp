import { Component, OnInit } from '@angular/core';

import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

members: Member[];
pagination: Pagination;
pageNumber = 1;
pageSize = 5

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {

    this.loadingMembers(this.pageNumber,this.pageSize);
  }

  loadingMembers(pageNumber, pageSize) {
       
         this.memberService.getMembers(pageNumber,pageSize).subscribe(
             paginatedResult => {
               this.members = paginatedResult.result;
               this.pagination = paginatedResult.pagination
             }
         )    
  }


  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadingMembers(this.pageNumber,this.pageSize);
  }





 
}
