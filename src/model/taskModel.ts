interface TaskItem {
  title: string;
  details: string | null;
  checked: boolean;
  important: boolean;
  createTime: string;
  expireTime: string | null;
  updateTime: string;
  createDate: string;
  userName: string;
}

class Task {
  title: string;
  details: string | null;
  checked: boolean;
  important: boolean;
  createTime: string;
  expireTime: string | null;
  updateTime: string;
  createDate: string;
  userName: string;

  constructor({
    title,
    details = null,
    checked,
    important,
    createTime,
    expireTime = null,
    updateTime,
    createDate,
    userName,
  }: TaskItem) {
    this.title = title;
    this.details = details;
    this.checked = checked;
    this.important = important;
    this.createTime = createTime;
    this.expireTime = expireTime;
    this.updateTime = updateTime;
    this.createDate = createDate;
    this.userName = userName;
  }
}
