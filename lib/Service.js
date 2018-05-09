/**
 * Created by yuanjianxin on 2018/5/9.
 */
const HttpUtil = require('yue-http-util');
const baseUrl = "https://talosapi.shujumohe.com/octopus";
const defaultHeaders = {'Content-Type': 'x-www-form-urlencoded'};
module.exports = class Service {

    static get instance() {
        if (!Service._instance)
            Service._instance = new Service();
        return Service._instance;
    }

    constructor() {
        this.partnerCode = null;
        this.partnerKey = null;
        this.isInited = false;
    }

    init({partnerCode, partnerKey}) {
        this.partnerCode = partnerCode;
        this.partnerKey = partnerKey;
        this.isInited = true;
    }


    /**
     * 创建任务
     * @param channel_type     渠道类型
     * @param channel_code     渠道编码
     * @param real_name        真实姓名
     * @param identity_code    身份证号码
     * @param user_mobile      手机号码
     * @param passback_params  透传参数
     * @returns {Promise.<void>}
     */
    async createTask(channel_type, channel_code, real_name, identity_code, user_mobile, passback_params) {

        if(!this.isInited) throw new Error(`==mohe have not init!==`);

        let url = baseUrl + "/task.unify.create/v3?partner_code=" + this.partnerCode + "&partner_key=" + this.partnerKey;
        let method = "post";
        let data = {channel_type, channel_code, real_name, identity_code, user_mobile, passback_params};
        return await HttpUtil.instance.sendRequest(method, url, data, defaultHeaders);

    }


    /**
     * 授权验证
     * @param task_id         任务编码
     * @param task_stage      请求阶段
     * @param request_type    请求类型
     * @param user_name       邮箱/手机号
     * @param login_type      登录类型 邮箱登陆为"1", 机登陆为"0"
     * @param sms_code        手机验证码
     * @returns {Promise.<*>}
     */
    async acquire({task_id, task_stage, request_type, user_name, login_type, sms_code}) {

        if(!this.isInited) throw new Error(`==mohe have not init!==`);

        let url = baseUrl + "/task.unify.acquire/v3?partner_code=" + this.partnerCode + "&partner_key=" + this.partnerKey;
        let method = "post";
        let data = {task_id, task_stage, request_type};
        user_name && (data.username = user_name);
        login_type && (data.login_type = login_type);
        sms_code && (data.sms_code = sms_code);
        return await HttpUtil.instance.sendRequest(method, url, data, defaultHeaders);
    }


    /**
     * 重发验证码
     * @param task_id  任务编码
     * @returns {Promise.<*>}
     */
    async retry(task_id) {

        if(!this.isInited) throw new Error(`==mohe have not init!==`);

        let url = baseUrl + "/task.unify.retry/v3?partner_code=" + this.partnerCode + "&partner_key=" + this.partnerKey;
        let method = "post";
        return await HttpUtil.instance.sendRequest(method, url, {task_id}, defaultHeaders);

    }


    /**
     * 查询任务结果（API/SDK）
     * @param task_id  任务编码
     * @param type     任务类型  api || sdk
     * @returns {Promise.<*>}
     */
    async queryTask(task_id,type){

        if(!this.isInited) throw new Error(`==mohe have not init!==`);

        let service=type && type.toLowerCase()=='api' && 'task.unify.query' || 'sdk.service.task.query';
        let url = baseUrl + "/"+service+"/v3?partner_code=" + this.partnerCode + "&partner_key=" + this.partnerKey;
        let method = "post";
        return await HttpUtil.instance.sendRequest(method, url, {task_id}, defaultHeaders);
    }


}