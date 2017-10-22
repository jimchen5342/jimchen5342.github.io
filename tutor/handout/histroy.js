let setting = {}, tag = "", label = "doc.setting";
$(document).ready(function(){
	let href = window.location.href;
	let arr = href.split("/");
	tag = arr[arr.length - 2] + "-" + arr[arr.length - 1].replace(".html", "");

  let s = localStorage.getItem(label);
  if(typeof s == "string" && s.length > 0)
    setting = JSON.parse(s);

  $('body').tabs({
		tabPosition: "right",
    headerWidth: 70,
    onSelect:function(title, index){
      setting[tag] = index;
      localStorage.setItem(label, JSON.stringify(setting));
		}
  });
  if(typeof setting[tag] == "number" && setting[tag] != 0)
      $('body').tabs("select", setting[tag]);
  $("body").tabs("resize")		
});