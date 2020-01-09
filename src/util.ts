export class Util {
  static getUUid(): string {
    return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }));
  }

  static download(blob:Blob, fileName: string, callback: Function) {
    if (navigator.msSaveOrOpenBlob) {
      // IE 或者 Edeg
      navigator.msSaveOrOpenBlob(blob, fileName);
      if (callback) callback();
      return;
    }
    const tmpa = document.createElement('a');
    tmpa.style.display = 'none';
    tmpa['href-lang'] = 'image/svg+xml';
    tmpa.download = fileName || `${new Date().getTime()}.png`;
    tmpa.href = URL.createObjectURL(blob); // 绑定a标签
    tmpa.target = '_blank';
    // firefox 需要添加到html文档中
    document.body.appendChild(tmpa);
    tmpa.click(); // 模拟点击实现下载
    setTimeout(function () { // 延时释放
      document.body.removeChild(tmpa);
      URL.revokeObjectURL(tmpa.href); // 用URL.revokeObjectURL()来释放这个object URL
      if (callback) callback();
    }, 100);
  }
}
