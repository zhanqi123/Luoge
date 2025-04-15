// 修改后的util方法
export const util = {
    downloadFileByByte(data, fileName) {
      // 假设data是后端返回的Base64字符串
      const blob = this.buildBlobByByte(data);
      this.downloadFile(blob, fileName);
    },
    buildBlobByByte(data) {

      const raw = window.atob(data);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        bytes[i] = raw.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    },
    downloadFile(blob, fileName) {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url); // 释放内存
    }
  };