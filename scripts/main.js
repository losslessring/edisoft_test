function FormParamsObject(objectParams){
 this.objectParams = objectParams
  
}

FormParamsObject.prototype.getFullObject = function() {
  return this.objectParams
}

//Вообще попытка доступа in к несуществующему свойству выдаст ошибку типа,
// и это правильно, но раз в задании выдает null, сделаю null
FormParamsObject.prototype.getObjectProperty = function(path) {
    
    var obj = this.objectParams

    path = path.replace(/\[(\w+)\]/g, '.$1') // конвертировать индексы в свойства
    path = path.replace(/^\./, '')           // убрать точку
    var array = path.split('.')
    for (var i = 0; i < array.length; ++i) {
        var prop = array[i]

        if (typeof obj === 'object'){
              if (prop in obj) {
                  obj = obj[prop]
              } else {
                  return
              }
        } else {
           return null
        }

    }     
          return obj        
      
}




FormParamsObject.prototype.setObjectProperty = function(path, value) {
    
  var obj = this.objectParams

  path = path.replace(/\[(\w+)\]/g, '.$1') // конвертировать индексы в свойства
  path = path.replace(/^\./, '')           // убрать точку
  var arrayPath = path.split('.')

  //Рекурсивная функция для добавления несуществующих свойств
  var addProp = function(array) {
      if (array.length === 1){
        
        return obj[array[0]] = value
      }
      // Если свойство уже есть и это объект, и в нем больше одного поля, тогда его пропускаем
      if(obj.hasOwnProperty(array[0]) && typeof obj[array[0]] ==='object' && Object.keys(obj[array[0]]).length > 1){
        // console.log(obj[array[0]])
         obj = obj[array[0]]

         addProp(array.slice(1))  
      } else {

        obj[array[0]] = {}
        obj = obj[array[0]]

        addProp(array.slice(1))  
      }
  }
  
  addProp(arrayPath)

}


//Превращаем объект, по ключам которого лежат массивы в массив объектов, в ключах
// которых лежат значения из массива по порядку следования. Проверок на длину массива не делал,
// по легенде одинаковые. Под ответ не подгонял - все по чесноку пашет - можно добавить и
// свойств в объект, и увеличить массивы. Главное чтобы массивы одинаковые были по размеру.

FormParamsObject.prototype.convertObjectToArray = function(path){

  var props = []
  var resultArray = []

  var propObj = this.getObjectProperty(path)

  for (var prop in propObj){

    props.push(prop)
  }


  var arrLength = propObj[props[0]].length

  for (var i = 0; i < arrLength ;i++){
    
        var tempObj = {}

        for (var prop in propObj){  

          Object.defineProperty(tempObj, prop, {
            value: propObj[prop][0]
          })
   
          propObj[prop].shift()
          
       }
       resultArray.push(tempObj)
    
  }
   
  this.setObjectProperty(path, resultArray)
  
  console.log(path)
  return resultArray
}



var params = new FormParamsObject(
  {
      param1: 'test1',
      param2: {
          param21: 'test2',
          param22: {
              number: ["123", "456", "789", "101112"],
              text: ["text1", "text2", "text3","text4"],
              id: ["5647654", "234320989867", "87687687687","0101019119"]
          }
      }
  }
)



//console.log(params.getFullObject())
 console.log(params.getObjectProperty('param2.param21'))

 console.log(params.getObjectProperty('param1.param11.param33'))

   params.setObjectProperty('param2.param21', 'new value')

   console.log(params.getObjectProperty('param2.param21'))

   params.setObjectProperty('param1.param11.param33','new value2')

   console.log(params.getObjectProperty('param1.param11.param33'))

       params.setObjectProperty('param3','hello 3')

    console.log(params.getObjectProperty('param1'))

  console.log(params.convertObjectToArray('param2.param22'))
  console.log(params.getFullObject())
  //console.log(params)