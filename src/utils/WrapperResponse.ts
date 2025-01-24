import {Notification} from "./Notification";

export class WrapperResponse {
  private data: object;
  private notifications: Notification[];

  constructor() {
    this.data = {};
    this.notifications = [];
  }

  setData(data: object) {
    this.data = data;
  }

  setNotifications(notifications: Notification[]) {
    this.notifications = notifications;
  }
  static of(data: object, notifications: Notification[]) {
    const instance = new WrapperResponse();
    instance.setData(data);
    instance.setNotifications(notifications);
    return instance;
  }
}
