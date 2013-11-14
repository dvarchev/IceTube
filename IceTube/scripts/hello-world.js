
document.addEventListener("deviceready", onDeviceReady, false);
var isFirstLoad = true;
var entries = [];

        var browserRef = null;
var entriesDataSource = null;
var sortingFields = ["published.date", "yt$statistics.viewCount" ];
var swiped = false
function handleSwipe(e)
{
    swiped = true;
    
    console.log(e.direction);
    if(e.direction == "right")
    {
        $(".slide-to-left").addClass("slide-out");
    }
    else
    {
        $(".slide-to-left").removeClass("slide-out");
    }
}
function handleTouchStart(){
    swiped = false;
}
function showSlideMenu(){
    $(".slide-to-left").toggleClass("slide-out");
}
function onDeviceReady() {
    if(isFirstLoad){
        $.get('https://gdata.youtube.com/feeds/api/users/Icenium/uploads?alt=json', function(data) {
            //$('.result').html(data);
            entries =data["feed"].entry;
            /*
            entries.sort(function(a, b) {
               var aViews =+a.yt$statistics.viewCount;
               var bViews = +b.yt$statistics.viewCount;
               return bViews - aViews;
            });*/
            for(var index in entries){
                var entry = entries[index];
                entry.yt$statistics.viewCount = +entry.yt$statistics.viewCount;
                entry.published.date = new Date(entry.published.$t);
            }
            entriesDataSource = kendo.data.DataSource.create({
                data: entries, 
                sort:{ 
                    field: sortingFields[0], 
                    dir: "desc" 
                } 
            });
            $("#flat-listview").kendoMobileListView({ 
                dataSource: entriesDataSource,
                click: listViewClick,
                template: $("#item-template").text(),
            });  
        //    alert('Load was performed.' + entries.length);
        });
        isFirstLoad = false;
        
        $("#select-sorting").kendoMobileButtonGroup({
            select: function() {
                entriesDataSource.sort({ field: sortingFields[this.selectedIndex], dir: "desc" });
            },
            index: 0
        });
         
    }
}

function listViewClick(e){
    if(!swiped)
    {
        var itemIndex = $(e.item).index(); 
		var entry = entries[itemIndex];
		var id = entry.id.$t.split("/").pop();
        var localStorageName = 'localStorage';
        var storage = window[localStorageName];
        storage.setItem('currentItem', JSON.stringify(entry))
        var strPath = window.location.href; 
        
        var path = strPath.substr(0,strPath.lastIndexOf('/')) + '/player.html' + '?id=' + id; 
        browserRef = window.open(path, '_blank', 'location=yes');
        
        browserRef.addEventListener('loadstop', function (event) {
            var suffix = "close";
            console.log(event.url);
            var shouldClose = url.indexOf(suffix) >= 0;
            if(shouldClose){
                browserRef.close();
            }
        });
    }
}