/**
 * Created by Administrator on 2016/9/28 0028.
 * 试卷模块
 *
 */
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
.controller("paperListController",["$scope","perperListService",function ($scope,subjectListService) {
    subjectListService.getAllperpar(function (data) {
       $scope.paperList=data;
    });
}])
    //试卷添加控制器
.controller("paperAddController",["$scope","subjectListService","paperModel","$routeParams","$location",function ($scope,subjectListService,paperModel,$routeParams,$location) {
    subjectListService.getAllDepartmentes(function (data) {
        //将全部方向绑定在dps
        $scope.dps=data;
    })
    var addSubjectId=$routeParams.id;

    if(addSubjectId!=0){
        paperModel.addSubjectId(addSubjectId);
        paperModel.Subjects(angular.copy($routeParams));
    }
    //双向绑定模板
    $scope.model=paperModel.pmodel ;
   $scope.save=function(){
        paperModel.savePaper($scope.model,function (data) {
            alert(data);
            paperModel.pmodel={
                departmentId:1,//方向id
                title:"",//试卷标题
                desc:"",//试卷描述
                at:0,//答题时间
                total:0,//总分
                scores:[ ],//每个题目的分值
                subjectIds:[ ],//每个题目的id
                subjects:[ ]
            }
            $location.path("/PaperAdd/id/0/stem/0/type/0/topic/0/level/0");
        })

   }
 }])
    //试卷删除控制器
.factory("paperModel",function ($http,$httpParamSerializer,$location) {
    return {
            pmodel:{
            departmentId:1,//方向id
            title:"",//试卷标题
            desc:"",//试卷描述
            at:0,//答题时间
            total:0,//总分
            scores:[ ],//每个题目的分值
            subjectIds:[ ],//每个题目的id
            subjects:[ ]
        },
        addSubjectId:function (id) {
           this.pmodel.subjectIds.push(id);
        },
        Subjects:function (subjects) {
           this.pmodel.subjects.push(subjects );
        },
        savePaper:function (data,hindler) {
            var arr={};
            for(var key in data){
                var val=data[key];
                switch(key){
                    case "departmentId":
                        arr['paper.department.id'] = val;
                        break;
                    case "title":
                        arr['paper.title'] = val;
                        break;
                    case "desc":
                        arr['paper.description'] = val;
                        break;
                    case "at":
                       arr['paper.answerQuestionTime'] = val;
                        break;
                    case "total":
                        arr['paper.totalPoints'] = val;
                        break;
                    case "scores":
                        arr['scores'] = val;
                        break;
                    case "subjectIds":
                        arr['subjectIds'] = val;
                        break;
                }
                obj= $httpParamSerializer(arr);
            }
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                hindler(data);
            })
        }
    }


})
.factory("perperListService",function ($http) {
    return {
        getAllperpar:function (hindler) {
            $http.get('http://172.16.0.5:7777/test/exam/manager/getAllExamPapers.action').success(function (data) {
                hindler(data);

            })
        }

    }
})