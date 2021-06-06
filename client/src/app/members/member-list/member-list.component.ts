import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

members: Member[];
pagination: Pagination;
userparams: UserParams;
user:User;
genderList = [{value: 'male', display: 'Males'}, {value:'female', display: 'Females'}]

  constructor(private memberService: MembersService, private accountService: AccountService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
        this.userparams = new UserParams(user);
      })
    
  }

  ngOnInit(): void {

    this.loadingMembers();
  }

  loadingMembers() {
       
         this.memberService.getMembers(this.userparams).subscribe(
             paginatedResult => {
               this.members = paginatedResult.result;
               this.pagination = paginatedResult.pagination
             }
         )    
  }


  resetFilters() {
    this.userparams = new UserParams(this.user);
    this.loadingMembers();
  }


  pageChanged(event: any) {
    this.userparams.pageNumber = event.page;
    this.loadingMembers();
  }


 
}
