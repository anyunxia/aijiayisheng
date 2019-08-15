const buttonAuth = (path)=>{
    var menuItem = JSON.parse(localStorage.getItem("menuItem"));
    console.log(menuItem)
    var button = [];
    var findButton = (menuItem)=>{
        menuItem.map((item)=>{
            if("subs" in item){
                findButton(item.subs);
            }else{
                if("/"+item.index == path){
                    if("button" in item){
                        button = item.button;
                    }
                }
            }
        });
    };
    findButton(menuItem);
    return button;
};

export default buttonAuth;