export class Notification {
  private status: string;
  private message: string;
  private type: string;
  private code: string;
  private entity_created: string;
  private entity_updated: string;
  constructor() {
    this.status = 'success';
    this.message = '';
    this.type = '';
    this.code = '';
    this.entity_created = '';
    this.entity_updated = '';
  }
  private setStatus(status: string) {
    this.status = status;
  }
  private setMessage(message: string) {
    this.message = message;
  }
  static of(status, message, type, code, entity_created, entity_updated) {
    const instance = new Notification();
    instance.status = status;
    instance.message = message;
    instance.type = type;
    instance.code = code;
    instance.entity_created = entity_created;
    instance.entity_updated = entity_updated;
    return instance;
  }
  static success(status, message) {
    const instance = new Notification();
    instance.setStatus(status);
    instance.setMessage(message);
    return instance;
  }
  static error(status, code, message, type) {
    const instance = new Notification();
    instance.status = status;
    instance.code = code;
    instance.message = message;
    instance.type = type;
    return instance;
  }
}
