function write_last_mod ()
{
    var loc = new String (document.location);
    if (loc.match (/\.html($|\?.*)|\/$/)) {
        var last_modified = new Date (document.lastModified);
        var date_stamp = "<p><small>letzte Modifikation";
        if (typeof (created) != 'undefined') {
            date_stamp += " created on <b>"
                       + created.toDateString ()
                       + "</b> and ";
        }
        date_stamp +=    ": <b>"
                       + last_modified.toDateString ()
                       + "</b>.</small></p>";
        document.writeln (date_stamp);
    }
}