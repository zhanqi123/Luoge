import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default {
  methods: {
    // 单个文件下载方法
    async downloadFileByUrl(fileUrl, fileName, voidid = 803, initList) {
      try {
        const data = {
          FileSaveName: fileUrl,
          voidid
        };
        this.$modal?.loading(`正在下载 ${fileName}...`);

        const response = await initList(data);

        if (response.Data) {
          const binaryString = atob(response.Data[0].byte);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error(response.ErrorInfo || '下载失败');
        }

        this.$modal?.closeLoading();
      } catch (error) {
        this.$modal?.closeLoading();
        this.$message.error(`"${fileName}" 下载失败：${error.message}`);
      }
    },

    // 批量下载方法（逐个下载）
    async batchDownloadFiles(files, initList, voidid = 803) {
      if (!files || files.length === 0) {
        this.$message.warning('没有可下载的文件');
        return;
      }

      for (const file of files) {
        await this.downloadFileByUrl(file.url, file.name, voidid, initList);
      }

      this.$message.success('所有文件下载完成');
    },

    // ZIP打包下载方法
    async zipDownloadFiles(files, zipName = '批量下载文件.zip', initList, voidid = 803) {
      if (!files || files.length === 0) {
        this.$message.warning('没有可下载的文件');
        return;
      }

      const zip = new JSZip();
      this.$modal?.loading(`正在打包下载 ${files.length} 个文件...`);

      for (const file of files) {
        const res = await initList({ FileSaveName: file.url, voidid });

        if (!res.Data) {
          this.$message.warning(`${file.name} 下载失败`);
          continue;
        }

        const binaryString = atob(res.Data[0].byte);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        zip.file(file.name, bytes, { binary: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, zipName);
      this.$message.success('文件打包下载成功');
      this.$modal?.closeLoading();
    }
  }
};