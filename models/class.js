var mongoose =  require('mongoose');

var classSchema = new mongoose.Schema({
    name: String,
    section: String,
    students:[{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
    res:[{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}],
    application:[{type: mongoose.Schema.Types.ObjectId, ref: 'Studentapplication'}],
    classTeacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
	classAttendance:[{date:String, attendance: {type: mongoose.Schema.Types.ObjectId, ref: 'Attendance'}}],
	subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}],
	periods: [{type: mongoose.Schema.Types.ObjectId, ref: 'Period'}],
    schoolName: String,
    schoolId:String,
    city: String
});

var Class = module.exports = mongoose.model('Class', classSchema);

//get city
module.exports.getClasses = function(callback, limit){
    Class.find(callback).limit(limit);
}

//get classes by school
module.exports.getClasseBySchool = function(schoolId, callback){
    console.log("getclassesBySchool :" + schoolId);
	Class.find({"schoolId":schoolId},callback);
}

//get classes by school
module.exports.getSubjectByClass = function(classId, callback){
	Class.find({"_id":classId},{subjects:1, _id:0},callback);
}

//get classes by school
module.exports.getClassByID = function(classId, callback){
    Class.findOne({"_id":classId},callback);
}

//add city
module.exports.addClasses = function(classes,callback){
    classes.forEach(function(classinst) {
        console.log("adding a class : " + classinst);
  Class.create(classinst, callback);
});
}

module.exports.addClass = function(classInst, schoolId, callback){
    //console.log( id " + schoolId);
    Class.create(classInst, function (err, awesome_instance,  schoolId) {
  if (err) return handleError(err);
        classId = awesome_instance._id;
  console.log("added from callback  " + awesome_instance);
        callback(classId, schoolId);
});
}

// Add classteacher
module.exports.addClassTeacher = function( teacherId, schoolId ,classname, section, classId, callback){
  console.log("got tidin scnd fn : " + teacherId + " classid : " + classId); 
  Class.findOneAndUpdate({"_id":classId}, {$push: {classTeacher: mongoose.Types.ObjectId(teacherId)}},{new: true},callback);
  //callback);
                        // (err,doc) => {
       //classId = doc._id;
       //console.log("update result doc : " + classId);
       //callback(classId);
   //});
}

module.exports.addSubjectToClass = function(classId, subjectId, callback){
 console.log("subjectid : " + classId + " : " + subjectId);
    Class.update({}, { subjects: []}, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});
	Class.findOneAndUpdate({"_id":classId}, {$push: {subjects: mongoose.Types.ObjectId(subjectId)}},{new: true}, callback);
}

module.exports.addPeriodToClass = function(id,periodId, callback){
	Class.findOneAndUpdate({"_id":id}, {$push: {periods: mongoose.Types.ObjectId(periodId)}},{new: true}, callback);
}

module.exports.addResourceToClass = function(classId, resourceId, callback){
 console.log("resourceid : " + classId + " : " + resourceId);
    Class.findOneAndUpdate({"_id":classId}, {$push: {res: mongoose.Types.ObjectId(resourceId)}},{new: true}, callback);
}

module.exports.addApplicationToClass = function(classId, applicationId, callback){
 console.log("appplicationid : " + classId + " : " + applicationId);
    Class.findOneAndUpdate({"_id":classId}, {$push: {application: mongoose.Types.ObjectId(applicationId)}},{new: true}, callback);
}

module.exports.addStudent = function( classId, studentid, callback) {
  console.log("got classid classadd fn : " + classId + " : " + studentid);    
	Class.findOneAndUpdate({"_id":classId}, {$push: {students: mongoose.Types.ObjectId(studentid)}},{new: true}, callback);
}

module.exports.removeStudent = function( classId, studentid, callback) {
  console.log("got classid classadd fn : " + classId + " : " + studentid);    
	Class.findOneAndUpdate({"_id":classId}, {$pull: {students: mongoose.Types.ObjectId(studentid)}},{new: true}, callback);
}

/* When bulk class edit will be enabled
module.exports.addStudents = function( classId, studentids, callback) {
  console.log("got classid scnd fn : " + classId); 
  var counter = 1;
  var limit = studentids.length;
  studentids.forEach(function(student) {       
    var query = {"_id": classId};  
	Class.findOneAndUpdate(query, {$push: {students: mongoose.Types.ObjectId(student)}},{new: true}, callback); //{
       //console.log("update result doc : " + doc);
    //});
   });
}
*/

function getClass(teacherid, schoolId, classname, section){
   var query = Class.findOneAndUpdate({schoolId:schoolId,name:classname,section:section}, {$push: {classTeacher: mongoose.Types.ObjectId(teacherid)}},{new: true});
   return query;
}