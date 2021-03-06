import { Component } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from './_services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedFeature = 'login';

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

}
