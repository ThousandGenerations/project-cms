import React, { Component } from "react";
// 单独封装Upload组件 上传组件和我的组件重名 给他换个名字
import {
  Button,
  // as 重命名
  Upload as AntdUpload,
  message,
} from "antd";
// 图标
import { UploadOutlined } from "@ant-design/icons";
// 七牛上传
import * as qiniu from "qiniu-js"; // 七牛上传SDK
// 上传请求
import { reqGetUploadToken } from "@api/edu/upload";
// 七牛配置文件
import qiniuConfig from "@conf/qiniu";
import { nanoid } from "nanoid"; // 用来生成唯一id

// 限制文件上传大小
const MAX_VIDEO_SIZE = 35 * 1024 * 1024; // 35mb

class Upload extends Component {
  // 首先先从本地读取token,如果本地有的话
  getUploadToken = () => {
    try {
      // 本地读取 解析成对象
      const { uploadToken, expires } = JSON.parse(
        localStorage.getItem("upload_token")
      );
      // 判断是否过期
      if (!this.isValidUploadToken(expires)) {
        throw new Error("error"); //直接进catch
      }
      // 有token直接用
      return {
        uploadToken,
        expires,
      };
    } catch {
      return {
        uploadToken: "",
        expires: 0,
      };
    }
  };
  // 初始化状态
  state = {
    // 获取token
    ...this.getUploadToken(),
    // 是否上传成功
    isUploadSuccess: false,
  };
  // 获取token
  fetchUploadToken = async () => {
    // 将请求数据保存
    const { uploadToken, expires } = await reqGetUploadToken();
    // 定义方法保存token
    this.saveUploadToken(uploadToken, expires);
  };

  // 保存token
  saveUploadToken = (uploadToken, expires) => {
    const data = {
      uploadToken,
      // 事件应该设置提前五分钟,因为发送请求返回响应都是有时间的
      expires: Date.now() + expires * 1000 - 5 * 60 * 1000,
    };
    // 更新状态
    this.setState(data);
    // 持久化
    window.localStorage.setItem("upload_token", JSON.stringify(data));
  };
  // 判断token是否过期
  isValidUploadToken = (expires) => {
    return expires > Date.now();
  };

  // 上传之前的准备工作的回调
  beforeUpload = (file) => {
    // 限制文件大小
    return new Promise(async (resolve, reject) => {
      if (file.size > MAX_VIDEO_SIZE) {
        message.warn("上传的视频不能大于35mb");
        return reject(); //终止上传
      }
      // 检查token有没有过期,如果过期了 就重新发送请求获取最新的,存在两个地方 state 和 localStorage
      // 取得过期事件
      const { expires } = this.state;
      if (!this.isValidUploadToken(expires)) {
        // 过期 重新请求
        await this.fetchUploadToken();
      }
      // file作为要上传的文件进行上传
      resolve(file);
    });
  };
  // 自定义上传视频方案
  customRequest = ({ file, onProgress, onSuccess, onError }) => {
    // 获取状态中的uploadToken
    const { uploadToken } = this.state;
    // console.log(uploadToken);
    const key = nanoid(10); // 生成长度为10随机id，并且一定会保证id是唯一的
    const putExtra = {
      fname: "", // 文件原名称
      mimeType: ["video/mp4"], // 限定上传文件类型
    };
    const config = {
      // 对象存储库位置(华北)
      region: qiniuConfig.region,
    };
    // 1. 创建上传的文件对象
    const observable = qiniu.upload(
      file, // 上传的文件
      key, // 上传的文件新命名,不是旧名字
      uploadToken, // 上传凭证
      putExtra,
      config
    );
    // 2. 创建上传过程触发回调函数对象
    const observer = {
      next(res) {
        // 上传过程中触发的回调函数
        // 上传总进度
        const percent = res.total.percent.toFixed(2);
        // 更新上次进度
        onProgress(
          {
            percent,
          },
          file
        );
        // 大于 4M 时可分块上传，小于 4M 时直传
        // 代表每一个块上传的进度
      },
      error(err) {
        // 上传失败触发的回调函数
        onError(err);
        message.error("上传视频失败~");
      },
      complete: (res) => {
        // 上传成功（全部数据上传完毕）触发的回调函数
        onSuccess(res);
        message.success("上传视频成功~");
        // console.log(res); // {hash: "FtaFsLF3Z_j_-q209fBTqb7pQheN", key: "mHhiHjtY3h"}
        const video = qiniuConfig.prefix_url + res.key;
        // onChange是Form.Item传入的，当你调用传入值时。这个值就会被Form收集
        this.props.onChange(video);
        // 隐藏按钮
        this.setState({
          isUploadSuccess: true,
        });
      },
    };
    // 3. 开始上传
    this.subscription = observable.subscribe(observer);

    // 上传取消
    // subscription.unsubscribe();
  }; // 移除
  remove = () => {};

  render() {
    const { isUploadSuccess } = this.state;
    return (
      <AntdUpload
        accept="video/mp4" // 决定上传选择的文件类型
        listType="picture"
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
        onRemove={this.remove}
      >
        {isUploadSuccess ? null : (
          <Button>
            <UploadOutlined /> 上传视频
          </Button>
        )}
      </AntdUpload>
    );
  }
}

export default Upload;
