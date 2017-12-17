var mongoose =  require('mongoose');

var ResourceSchema = new mongoose.Schema({
    classid: String,
    value: String,
    title:String,
    type:String,
	time: String,
    date: Date
});

var Resource = module.exports = mongoose.model('Resource', ResourceSchema);

module.exports.getResource = function(callback, limit){
    Resource.find(callback).limit(limit);
}

//get res by id
module.exports.getResourceByID = function(resId, callback){
    Resource.findOne({"_id":resId},callback);
}

module.exports.addResource = function(resource,callback){
  Resource.update({}, { time: "" }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});
  Resource.create(resource, callback);
}

module.exports.getResourceByClass = function(classId,callback){
    Resource.find({"classid":classId},{date:1,title:1},callback);
}

