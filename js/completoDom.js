'use strict'


//Objeto apra validar  las propiedades del formualrio
var propForm = {
    //Entradas del formulario ripo input y con clase validar
    entradas: document.querySelectorAll("input.validar"),
    //Utilizado para obtener el valor de cada input
    valor: null,
    //utilizado para definir expreseiones regulares
    expresionRegular:null,
    //arreglo que contiene todos los resultados de la validación
    validaciones: new Array()
    

}
//  ********** OBJETO PARA REALIZAR VALIDACIONES

var valForm = {
    //Función que valida textos con  valores maximos, minimos,y expresiones 
    //regulares
   
    valText:function(min,max,propVal,inpVal,menError,expresionRegular ){
       
   
       if(propVal.length < min || propVal.length > max || !expresionRegular.test(propVal) ){
           //Al existir un error se muestra un mensaje de advertencia en un span 
           inpVal.innerHTML = '<span style="color:red">*Error al ingresar los datos: '+menError+'</span>';

           return false;

       }else{
          //Si no existe error borramos el  span
           inpVal.parentNode.removeChild(inpVal);

          return true;

       }
      
    },
    //Método para validar expresiones regulares 
    valExpRegular:function(expresionRegular,propFormVal,inpVal,menError){
        
       if(!expresionRegular.test(propFormVal)){
           //Si es incorrecta la validación se muestra el mensaje de advertencia
           inpVal.innerHTML = '<span style="color:red">*Error al ingresar los datos: '+menError+'</span>';

           return  false;

       }else{

            //En caso contrario se elimina el mensaje que anteriormente fue creado
           inpVal.parentNode.removeChild(inpVal);

           return  true;
       }

    }
}

//***OBJETO PARA TODOS LOS METODOS DEL FORMULARIO */

var metFormulario = {

    
    // Método que permite definir los eventos que se disparan
    // para los campos a validar
    //eventos de focus, blur y change
   inicioFormulario: function(){
   
        
       for(var i = 0; i < propForm.entradas.length; i++){

           propForm.entradas[i].addEventListener("focus", metFormulario.inpFoco);
           propForm.entradas[i].addEventListener("blur", metFormulario.inpFueraFoco);  
           propForm.entradas[i].addEventListener("change", metFormulario.changeInput); 
           
       }   

   },
  
    //Función que valida cuando se tiene el foco en el input respectivo
    //para lo cual recibe como paramétro el input  sobre el cual se disparao
    //el evento
   inpFoco: function(input){
       
       //Camputaramos el valor del input respectivo
       //console.log("en foco"+input.target.id);
       
       propForm.valor = input.target.value;
       
       
       // Si el campo esta vacío aparece el span obligarorio que le indica que 
       //el campo es obligatorio y además cambia el fonfo del input
      if(propForm.valor == ""){

            document.querySelector("#"+input.target.id).style.background = "rgba(255,0,0,.05)";
            document.querySelector("#"+input.target.id).style.borderBottom =  "6px solid rgba(255, 0, 0, 0.8) ";
            document.querySelector("[for="+input.target.id+"] .obligatorio").style.display = 'block';
            console.log("[for="+input.target.id+"] .obligatorio");
            
       

       }
       //Creamos un elemento en el DOM  para hacer una descripción correcta acerca del 
       //mensaje de validación, así se crea un div en el label del respectivo input
       document.querySelector("[for="+input.target.id+"]").appendChild(document.createElement("DIV")).setAttribute("class","error")
       
      

   },
   
   //Función  que se dispara con el evento blur, y recibe como parametro
   //el correspondiente input que dispara el evento
   inpFueraFoco: function(input){
       console.log("fuera de foco"+input.target.id);
       //Nuevamente dejamos el fondo del input blanco.
         document.querySelector("#"+input.target.id).style.background = "white";
        //desaparecemos el span de campo obligatorio
       document.querySelector("[for="+input.target.id+"] .obligatorio").style.display = 'none';

   },
   changeInput: function(input){
       console.log("estoy cambiando"+input.target.id);
    //Permite alamacenar el valor para cada validación a realizar
    let validar= false;
    //Recuperamos el valor de cada input
    propForm.valor = input.target.value;
    //Determina el tipo de Input a recibir
    var tipo = input.target.type;
    console.log(input.target.id+"es de tipo"+input.target.type);
   
    
    switch(tipo)
    {
           
            case "date":
            if(propForm.valor != "")
            {
               var fecha = new Date(propForm.valor);
               console.log(fecha);
               if(fecha)
               {
                   console.log("fecha correcta");
                   var y = fecha.getUTCFullYear();
                   var m = fecha.getUTCMonth()+1;
                   var d = fecha.getUTCDate();
                   //var diaActual = (new Date(y, m, 0)).getDate();
                   var diaActual = new Date().getUTCDate();
                   console.log(diaActual);
                   console.log("año"+y,"mes"+m,"dia"+d);
                   var resultado =   m >= 0 && m < 12 && y > 1900 && y < 32768 && d > 0 && d <= diaActual ;
                   propForm.validaciones["fechaIng"] = resultado;
                   if(resultado){
                    document.querySelector("[for="+input.target.id+"] .error").parentNode.removeChild(document.querySelector("[for="+input.target.id+"] .error"))
                   }
                   else{
                    document.querySelector("[for="+input.target.id+"] .error").innerHTML = '<span style="color:red">*Error al ingresar los datos: El formato correcto es dd/mm/yyyy la fecha no puede ser superior a la actual </span>';
                   }
               }
               
            }
            
            else{
                document.querySelector("[for="+input.target.id+"] .error").innerHTML = '<span style="color:red">*Error al ingresar los datos: El formato correcto es dd/mm/yyyy </span>';
                propForm.validaciones["fechaIng"] = false;

            }
            
            break;
               
            case "text":
            
                if(propForm.valor != "")
                    {
                        propForm.expresionRegular = /^[a-zA-Z]+$/;
                        validar = valForm.valText(2,6,propForm.valor,document.querySelector("[for="+input.target.id+"] .error"),input.target.placeholder,propForm.expresionRegular);
                        console.log(validar);
                        propForm.validaciones["nombre"] = validar;
                        console.table(propForm.validaciones);
                     }
                else{
                    document.querySelector("[for="+input.target.id+"] .error").parentNode.removeChild(document.querySelector("[for="+input.target.id+"] .error"))
                }
            break;
            case "email":
                if(propForm.valor != "")
                    {
                        propForm.expresionRegular = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                        validar = valForm.valExpRegular(propForm.expresionRegular,propForm.valor,document.querySelector("[for="+input.target.id+"] .error"),input.target.placeholder)
                        console.log(validar);
                        propForm.validaciones["email"] = validar;
                    }
                else{
                        document.querySelector("[for="+input.target.id+"] .error").parentNode.removeChild(document.querySelector("[for="+input.target.id+"] .error"))
                    }
                    console.table(propForm.validaciones);
            break;
            case "password":
            
            if(propForm.valor != "")
                    {
                        propForm.expresionRegular = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
                        validar = valForm.valExpRegular(propForm.expresionRegular,propForm.valor,document.querySelector("[for="+input.target.id+"] .error"),input.target.placeholder)
                        console.log(validar);
                        propForm.validaciones["password"] = validar;
                        console.log(propForm.validaciones["password"]);
                       
                        
                    }
            else{
                        document.querySelector("[for="+input.target.id+"] .error").parentNode.removeChild(document.querySelector("[for="+input.target.id+"] .error"))
                    }
            
            break;


    }
    
    },
    validaTotal:function(arreglo){
           
        let resVal = false;
        for(var clave in arreglo) {
           if(arreglo[clave]== false)
           {
               resVal = true;
               return resVal;

           }

        }
        return resVal;

     },
     valFormCompleto:function(){
         
        console.table(propForm.validaciones);
        var valida = propForm.validaciones;
        console.table(valida);
        let resultValidacion = false;
        if (valida.length<=0) {
            resultValidacion = true;
        }
        else{
            console.log(metFormulario.validaTotal(valida));
            resultValidacion = metFormulario.validaTotal(valida);
        }
        
        //Si todas existe en el arreglo algun elemento con el valor de false
        //Mostramos el respectivo mensaje de error
        if(resultValidacion)
        {
            resultado.style.display = "none"
            document.querySelector("#labelEnviar").innerHTML ='<span style="color:red">¡*Tiene errores en los datos que ha ingresado, favor revisar de nuevo.</span>';
            
        }
        else{
            
            
            

        }
    }
   
       
}
    metFormulario.inicioFormulario();   
           