/**
 * Created by Administrator on 2016/9/22 0022.
 * 题目管理的js模块
 */
angular.module("app.subject",["ng"])
    .controller("subjectheController",["$scope","$location","subjectListService","$document","subjectservice","$routeParams",
    function ($scope,$location,subjectListService,$document,subjectservice,$routeParams){
            var id=$routeParams.id;
            var checkState=$routeParams.checkState;
             subjectservice.shengHe(id,checkState,function (data) {
                 alert(data);
                 $location.path("/AllSubject/a/0/b/0/c/0/d/0");
             })
    }])
 .controller("subjectDelController",["$scope","$location","subjectListService","$document","subjectservice","$routeParams",
    function ($scope,$location,subjectListService,$document,subjectservice,$routeParams){
        var flag=confirm("确认删除吗");
        if(flag){
            var id=$routeParams.id;
            subjectservice.del(id,function (data) {
                alert(data);
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            })
        }else{
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }
    }])
.controller("subjectController",["$scope","$location","subjectListService","$document","subjectservice","$routeParams",
    function ($scope,$location,subjectListService,$document,subjectservice,$routeParams) {
            //将路由参数绑定到作用域中
                $scope.subject={
                    typeId:1,
                    levelId:1,
                    departmentId:1,
                    topicId:1,
                    tem:"",
                    answer:"",
                    fx:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                $scope.params=$routeParams;
                    $scope.SubjectAdd=function () {
                        $location.path("/addSubject");
                    };
                subjectListService.getAllSubjectType(function (data) {
                        $scope.Subjects=data;
                });
                subjectListService.getAllDepartmentes(function (data) {
                        $scope.subdepartments=data;
                })
                subjectListService.getAllTopics(function (data) {
                        $scope.Topics=data;

                })
                subjectListService.getAllSubjectLevel(function (data) {
                        $scope.SubjectsLevel=data;
                })
                subjectservice.getAllSubjects($scope.params,function (data) {
                   $scope.AllSubjects= data;
                        data.forEach(function (subject,index) {
                            var ggg=[];
                                subject.choices.forEach(function (choice,index) {
                                    choice.no=subjectListService.converIndexToNo(index);
                                });
                                if('subject.subjectType.id'!=3){
                                    subject.choices.forEach(function (choice) {
                                        if(choice.correct){
                                            ggg.push(choice.no)
                                        }
                                    })
                                    subject.answer = ggg;
                                }


                        })

                })
                $scope.submit=function () {
                    subjectservice.saveSubject ($scope.subject,function (data) {
                        alert("添加成功");
                        var subject={
                            typeId:1,
                            levelId:1,
                            departmentId:1,
                            topicId:1,
                            tem:"",
                            answer:"",
                            fx:"",
                            choiceContent:[],
                            choiceCorrect:[false,false,false,false]
                        };
                        angular.copy(subject,$scope.subject)
                    });
                    //重置作用域中绑定的表单默认

                }
                $scope.submitCloseAll=function () {
                    subjectservice.saveSubject($scope.subject, function (data) {
                        alert("添加成功");
                        $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                    })
                    /* subjectListService.getDepartmentTopics(function (data) {
                     $scope.DepartmentTopics=data;
                     })*/
                }
        }])
            .service("subjectservice",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
                this.shengHe=function (id,checkState,hindler) {
                    $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                        params:{
                            'subject.id':id,
                            'subject.checkState':checkState
                        }
                    }).success(function (data) {
                        hindler(data);
                    })
                }
                this.del=function (id,hindler) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                    params:{
                        'subject.id':id
                    }
                }).success(function (data) {
                    hindler(data);
                })
                }
                this.saveSubject=function (obj,hindler) {
                    var data={};
                    for(key in obj){
                        var val=obj[key];
                        if(val!=0){
                            switch(key){
                                case 'typeId':data['subject.subjectType.id']=val ;break;
                                case 'levelId':data['subject.subjectLevel.id']=val ;break;
                                case 'departmentId':data['subject.department.id']=val ;break;
                                case 'tem':data['subject.stem']=val ;break;
                                case 'answer':data['subject.answer']=val ;break;
                                case 'fx':data['subject.analysis']=val ;break;
                                case 'choiceContent':data['choiceContent']=val;break;
                                case 'choiceCorrect':data['choiceCorrect']=val;break;
                            }
                        }

                    }
                    //对Obj对象进行表单格式的序列化（默认使用JSON格式）
                    data=$httpParamSerializer(data);
                    $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",data,{
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        }
                    }).success(function (data) {
                        hindler(data);
                    })
                }
                this.getAllSubjects=function (params,hindler) {
                    var obj={};
                    for(key in params){
                        var val=params[key];
                        if(val!=0){
                            switch(key){
                                case 'a':obj['subject.subjectType.id']=val;
                                    break;
                                case 'b':obj['subject.department.id']=val;
                                    break;
                                case 'c':obj['subject.topic.id']=val;
                                    break;
                                case 'd':obj['subject.subjectLevel.id']=val;
                                    break;
                            }
                        }

                    }
                    $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                        params:obj
                    }).success(function (data) {
                        //$http.get("data/subjects.json").success(function (data) {
                        hindler(data);
                    })
                }
            }])
        .provider("subjectListService",function () {
            this.url="";
            this.setUrl=function (url) {
                this.url=url;
            };
            this.$get=function ($http,$document) {
                    var self=this;
                        return {
                            converIndexToNo:function (index) {
                                return index==0?'A':(index==1?'B':(index==2?'C':(index==3?'D':"")));
                            },
                                 getAllSubjectType:function (hindler) {
                                     //$http.get("data/type.json").success(function (data) {
                                      $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                                                 hindler(data);
                                         })
                                 },
                                getAllDepartmentes:function (hindler) {
                                  //$http.get("data/departments.json").success(function (data) {
                                     $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                                                hindler(data);
                                        })
                                },
                                getAllTopics:function (hindler) {
                                  //$http.get("data/topics.json").success(function (data) {
                                     $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                                                hindler(data);
                                        })
                                },
                                getAllSubjectLevel:function (hindler) {
                               //$http.get("data/levels.json").success(function (data) {
                              $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                                    hindler(data);
                                })
                            }
                 }

            }

    })
            .filter("selectTopics",function () {
                //input要过滤的内容
                    return function (input,id) {
                        if(input){
                        var result=input.filter(function (item,index) {
                            return   item.department.id==id;
                        })
                        //将过滤后的结果返回
                        return result;
                    }
                }
            })
         .config(["$routeProvider",function ($routeProvider) {
            //subjectListServiceProvider.setUrl("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action");
            $routeProvider.when("/addSubject",{
                templateUrl:"tpl/subject/subjectAdd.html",
                controller:"subjectController"
        }).when("/deleteSubject/id/:id",{
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectDelController"
            })
                .when("/heSubject/id/:id/checkState/:checkState",{
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectheController"
            })

}])
            .directive("selectOption",function () {
                return {
                    restrict:"A",
                        link:function (scope,element,attribute,controller) {
                           element.on("change",function () {
                               var type=$(this).attr("type");
                               var val=$(this).val();
                               //重置
                               if(type=='radio'){
                                   scope.subject.choiceCorrect=[false,false,false,false];
                                   //首先得重置单选框
                                    for(var i=0;i<4;i++){
                                        if(i==val){
                                            scope.subject.choiceCorrect[i]=true;
                                        }//把选中的单选框value与该索引对比如果相等则把索引为i的传进为True
                                    }
                               }else if(type=='checkbox'){
                                       for(var i=0;i<4;i++){
                                               if (i == val) {
                                                   scope.subject.choiceCorrect[i] = true;
                                               }//把选中的复选框value与该索引对比如果相等则把索引为i的传进为True
                                   }

                               }
                               scope.$digest();
                           })
                        }
                }
            })
