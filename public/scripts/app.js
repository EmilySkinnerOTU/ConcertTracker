//couldn't get this part to work

(function(){
    function Start()
    {
        console.log("App Started");
        let deleteButtons = document.querySelectorAll('.btn-danger');


    for(button of deleteButtons)
    {
        button.addEventListener('click',(event)=>{
            if(!confirm("Are you sure you want to remove this concert?"))
            {
                event.preventDefault();
                window.location.assign('/concerts');
            }
        });
    }
    }
    window.addEventListener("load", Start);
})();