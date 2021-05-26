import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
   model: any = {}
  constructor(private accountService: AccountService, private toastr: ToastrService) {
             

   }

  ngOnInit(): void {
  }

  register() 
  {
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    }, error => {
      console.log(error);
      this.toastr.error(error);
      
    })
  }

  cancel() {
    
       this.cancelRegister.emit(false);
    }

}
