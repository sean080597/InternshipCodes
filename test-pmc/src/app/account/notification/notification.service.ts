import { Injectable } from '@angular/core';
import { Notify } from '@app/_models/account/notification.model';
import { AccountService } from '@app/_services';
import { NotifyComponent } from './notification.component';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  constructor(private accountService: AccountService) {}
  private modals: NotifyComponent[] = [];
  public isExpand = false;

  get(id: string) {
    return this.modals.find((t) => t.id === id);
  }

  add(notify: NotifyComponent) {
    // add notify to array of active modals
    this.modals.push(notify);
  }

  remove(id: string) {
    // remove notify from array of active modals
    this.modals = this.modals.filter((x) => x.id !== id);
  }

  async stroke(id: string): Promise<any> {
    // open notify specified by id
    const notify = this.modals.find((x) => x.id === id);
    notify.stroke();
    this.isExpand = !this.isExpand;
    if (this.isExpand) {
      const params =  {page: 1,  pageSize: this.modals[0].pageSize};
      return this.accountService.getBellsList(params).toPromise().then((resp) => {
        (this.modals[0] as NotifyComponent).availablePages = resp.availablePages;
        (this.modals[0] as NotifyComponent).notifyList = resp.items.map(
          (item) => new Notify(item)
        )
        return resp.newNumber;
      });

    }
  }

  isShowed() {
    return this.modals.every((t: any) => !t.isMode);
  }
}
