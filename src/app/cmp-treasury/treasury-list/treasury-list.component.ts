import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { AppConfigService } from '../../_services/app-config.service';
import { DispatchTicketService } from '../../_services/dispatch-ticket.service';
import { TreasuryService } from '../../_services/treasury.service';

import { AlertService } from '../../_services/alert.service';
import { CurrentUserService } from '../../_services/current-user.service';
import { DispatchTicket } from '../../_models/dispatch-ticket.model';
import { Treasury } from '../../_models/treasury.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-treasury-list',
  templateUrl: './treasury-list.component.html',
  styleUrls: ['./treasury-list.component.css']
})
export class TreasuryListComponent implements OnInit {
  dts: DispatchTicket[] = [];
  trsLogs: any = [];
  dtsSubscription: Subscription;
  subjectSubscription: Subscription;
  currentUser: any;

  trs: Treasury;
  trsSubscription: Subscription;
  txtUpdateBalance = 0;
  isActive: boolean = true;

  constructor(
    private alert: AlertService,
    private authenticationService: AuthenticationService,
    private dtService: DispatchTicketService,
    private route: ActivatedRoute,
    private router: Router,
    private currentUserService: CurrentUserService,
    private treasuryService: TreasuryService
  ) { }

  ngOnInit() {
    this.onFilter(this.isActive);
    this.loadTreasuryInfo();
    this.currentUser = this.currentUserService.getCurrentUserInfo();
    this.loadTreasuryLog();


    this.dtsSubscription = this.dtService.DispatchTicketChanged
      .subscribe(
        (dts: DispatchTicket[]) => {
          this.dts = dts;
          this.loadTreasuryInfo();
          this.loadTreasuryLog();
        }
      );

  }

  onFilter(isActiveParam: boolean) {

    this.isActive = isActiveParam;
    if (isActiveParam) {
      this.dtsSubscription = this.dtService.getActiveDispatchTickets()
        .subscribe(
        (dts: DispatchTicket[]) => {
          this.dts = dts;
          this.dtService.setListDispatchTicket(dts);
        }
        );

    } else {
      this.dtsSubscription = this.dtService.getDispatchTickets()
        .subscribe(
        (dts: DispatchTicket[]) => {
          this.dts = dts;
          this.dtService.setListDispatchTicket(dts);
        }
        );
    }

    this.dts = this.dtService.getListDispatchTicket();
  }


  updateTreasuryBalance() {
    let cfResult = confirm('Confirm to update Treasury balance to (' + this.txtUpdateBalance + ')?');
    if (cfResult === false) return;

    let newTrs: Treasury = new Treasury();
    newTrs = this.trs;
    newTrs.treasuryBalance = this.txtUpdateBalance;


    this.trsSubscription = this.treasuryService.updateTreasuryBalance(newTrs, this.currentUser.fullName)
      .subscribe(data => {
        if (data['success']) {
          this.alertSuccess(data['message']);
          this.loadTreasuryInfo();
          this.loadTreasuryLog();
          this.onFilter(this.isActive);
        } else {
          this.alertError(data['message']);
        }
      });
  }
  loadTreasuryLog() {
    this.trsSubscription = this.treasuryService.getTreasuryLatestLog()
      .subscribe(
      (tsrLog: any[]) => {
        this.trsLogs = tsrLog;
      }
      );
  }


  loadTreasuryInfo() {
    this.trsSubscription = this.treasuryService.getTreasuryInfo()
      .subscribe(
      (trs: Treasury[]) => {
        this.trs = trs[0];
      }
      );
  }

  uploadCsv() {
    this.router.navigate(['/treasury-upload-csv'], { relativeTo: this.route });
  }

  alertSuccess(msg: string) {
    this.alert.success(msg, true);
  }

  alertError(msg: string) {
    this.alert.error(msg, true);
  }

}
