(function(){
    var ggaExtender = function(){
        if (window.location.hostname != 'gogoanimeapp.com') {
            return;
        }
        var tag = document.body.querySelector('.anime_video_body_watch');
        if (tag) {
            var frame = tag.querySelector('iframe');
            if (frame) {
                if (frame.id == 'mx-ggax') frame.id = '';
                else frame.id = 'mx-ggax';
            }
        }
    };
    if (typeof window.addHook == 'function') {
        window.addHook(ggaExtender);
    }
})();
