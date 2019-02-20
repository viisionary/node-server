import orderModel from '../db/entity/orders'

export function countAll(obj){
//获得订单总数
  return orderModel.count()
}
export function insertOneByObj(obj){
//创建订单
  return orderModel.create(obj);
}

//针对非generator的存取操作
export function countAllNormal (obj,cb){
  return orderModel.count(obj || {},cb)
}

export function insertOneByObjNormal(obj,cb){
  return orderModel.create(obj || {},cb)
}
