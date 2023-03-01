/**
 * Notes: 预约后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code3721.com
 * Date: 2022-12-08 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

const MeetModel = require('../../model/meet_model.js');
const JoinModel = require('../../model/join_model.js');
const UserModel = require('../../model/user_model.js');

const DataService = require('./../data_service');

// 导出报名数据KEY
const EXPORT_JOIN_DATA_KEY = 'join_data';

// 导出用户数据KEY
const EXPORT_USER_DATA_KEY = 'user_data';

class AdminExportService extends BaseAdminService {
	// #####################导出报名数据
	/**获取报名数据 */
	async getJoinDataURL() {
		let dataService = new DataService();
		return await dataService.getExportDataURL(EXPORT_JOIN_DATA_KEY);
	}

	/**删除报名数据 */
	async deleteJoinDataExcel() {
		let dataService = new DataService();
		return await dataService.deleteDataExcel(EXPORT_JOIN_DATA_KEY);
	}

	// 根据表单提取数据
	_getValByForm(arr, mark, title) {
		for (let k in arr) {
			if (arr[k].mark == mark) return arr[k].val;
			if (arr[k].title == title) return arr[k].val;
		}

		return '';
	}

	/**导出报名数据 */
	async exportJoinDataExcel({
		meetId,
		startDay,
		endDay,
		status
	}) {
    let where = {
      JOIN_MEET_ID: meetId,
      JOIN_STATUS: status,
      JOIN_MEET_DAY: 	['between', startDay,endDay]
    }
    let orderBy = {
			'JOIN_ADD_TIME': 'desc'
		};
    let fileds= "*"
    let joinList = await JoinModel.getAll(where, fileds,orderBy)
    const arrayList = []
    for (const key in joinList) {
       let objArr =  Object.values(joinList[key]);
       arrayList.push(objArr)
    }
    let dataService = new DataService();
    return await dataService.exportDataExcel(EXPORT_JOIN_DATA_KEY,"报名数据",joinList.length,arrayList);
	}


	// #####################导出用户数据

	/**获取用户数据 */
	async getUserDataURL() {
		let dataService = new DataService();
		return await dataService.getExportDataURL(EXPORT_USER_DATA_KEY);
	}

	/**删除用户数据 */
	async deleteUserDataExcel() {
		let dataService = new DataService();
		return await dataService.deleteDataExcel(EXPORT_USER_DATA_KEY);
	}

	/**导出用户数据 */
	async exportUserDataExcel(condition) {
    let where = JSON.parse(decodeURIComponent(condition))
    let fields = '*';
    let orderBy = {
      'USER_ID': 'asc'
    };
    let userList = await UserModel.getAll(where,fields,orderBy)

    const arrayList = []
    for (const key in userList) {
       let objArr =  Object.values(userList[key]);
       arrayList.push(objArr)
    }
    console.log(arrayList)
		let dataService = new DataService();
    return await dataService.exportDataExcel(EXPORT_USER_DATA_KEY,"理发店用户数据",userList.length,arrayList)
	}
}

module.exports = AdminExportService;