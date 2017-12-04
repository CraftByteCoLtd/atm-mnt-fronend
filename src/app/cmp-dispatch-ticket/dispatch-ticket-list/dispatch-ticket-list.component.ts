import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { AppConfigService } from '../../_services/app-config.service';
import { DispatchTicketService } from '../../_services/dispatch-ticket.service';

import { CurrentUserService } from '../../_services/current-user.service';
import { DispatchTicket } from '../../_models/dispatch-ticket.model';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-dispatch-ticket-list',
  templateUrl: './dispatch-ticket-list.component.html',
  styleUrls: ['./dispatch-ticket-list.component.css']
})
export class DispatchTicketListComponent implements OnInit {

  dts: DispatchTicket[] = [];
  dtsSubscription: Subscription;
  subjectSubscription: Subscription;
  currentUser: any;
  isActive: boolean = true;

  constructor(
    private authenticationService: AuthenticationService,
    private dtService: DispatchTicketService,
    private route: ActivatedRoute,
    private router: Router,
    private currentUserService: CurrentUserService,

  ) { }

  ngOnInit() {
   this.onFilter(true);
   this.currentUser = this.currentUserService.getCurrentUserInfo();

  }

  onFilter(isActiveParam:boolean){
    this.isActive = isActiveParam;
    if (isActiveParam) {
     this.dtsSubscription = this.dtService.getActiveDispatchTickets()
     .subscribe(
       (dts: DispatchTicket[]) => {
         this.dts = dts;
         this.dtService.setListDispatchTicket(dts);
       }
     );

    }else{
    this.dtsSubscription = this.dtService.getDispatchTickets()
     .subscribe(
       (dts: DispatchTicket[]) => {
         this.dts = dts;
         this.dtService.setListDispatchTicket(dts);
       }
     );
    }
     
     this.dtsSubscription = this.dtService.DispatchTicketChanged
      .subscribe(
        (dts: DispatchTicket[]) => {
          this.dts = dts;
        }
      );

     this.dts = this.dtService.getListDispatchTicket();

  }
  onAddNew(){
    this.onFilter(true);
    this.router.navigate(['new'], { relativeTo: this.route });
  }

}
