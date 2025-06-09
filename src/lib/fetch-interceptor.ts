import { toast } from "react-hot-toast";

interface FetchError extends Error {
  status?: number;
  statusText?: string;
}

class FetchInterceptor {
  private originalFetch: typeof fetch;

  constructor() {
    this.originalFetch = window.fetch;
    this.init();
  }

  private init() {
    window.fetch = async (...args) => {
      try {
        const response = await this.originalFetch(...args);
        // 处理HTTP错误
        if (!response.ok) {
          const error: FetchError = new Error(`HTTP error! status: ${response.status}`);
          error.status = response.status;
          error.statusText = response.statusText;
          this.handleError(error);
          throw error;
        }

        return response;
      } catch (error) {
        // 处理网络错误
        this.handleError(error as FetchError);
        throw error;
      }
    };
  }

  private handleError(error: FetchError) {
    let message = "网络请求失败";

    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      message = "网络连接失败，请检查网络设置";
    } else if (error.status) {
      switch (error.status) {
        case 401:
          message = "未授权，请重新登录";
          break;
        case 403:
          message = "拒绝访问";
          break;
        case 404:
          message = "请求的资源不存在";
          break;
        case 500:
          message = "服务器错误";
          break;
        default:
          message = `请求失败 (${error.status})`;
      }
    }

    // 使用toast显示错误信息
    toast.error(message, {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#333",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
      },
    });
  }
}

export const initFetchInterceptor = () => {
  new FetchInterceptor();
};
