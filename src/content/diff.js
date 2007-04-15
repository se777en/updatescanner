function diffTest() 
{
//         0     1    2  3 4    5  6   7   8    9   10   11   12    13   14    
    diff0="Hello ths is a <tag goes here />test to see how well the diff will work. This quick first test has only words with no lines or tags, so might not work too well.";
//15 16   17  18   19    20   21 22    23 24    25 26    27  28   29  30

//         0     1    2  3 4  5   6   7    8      9         10   11     12   13
    diff1="Hello this is a to <script>does this get cut? </script>see how well Pete's fantastic diff engine will work the. This quick first test has only <i> words </i> with no lines or <b>tags</b>, so might not work too well.";
//14   15   16    17    18   19  20   21    22   23 24    25 26    27 28    29  30   31  32

    diff2="Hello this is a <tag shouldall here />test to see how well the diff will work. This quick first test has only words with no lines or tags, so might not work too well.";

//    diff0 = readFile("c:\\Projects\\search.htm");
//    diff1 = readFile("c:\\Projects\\search2.htm");

    var win = getTopWin();
    d_doc = win.content.document;

    var htmlText = WDiffString(diff0, diff2);

    d_doc.writeln(htmlText);
    d_doc.close();

}

function readFile(str_Filename) 
{ 
    try { 
        var obj_File = Components.classes["@mozilla.org/file/local;1"].
               createInstance(Components.interfaces.nsILocalFile); 
        obj_File.initWithPath(str_Filename); 
        var obj_InputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].
               createInstance(Components.interfaces.nsIFileInputStream); 
        obj_InputStream.init(obj_File,0x01,0444,null); 
        var obj_ScriptableIO = Components.classes["@mozilla.org/scriptableinputstream;1"].
               createInstance(Components.interfaces.nsIScriptableInputStream); 
        obj_ScriptableIO.init(obj_InputStream); 
    } catch (e) { 
        alert(e); 
    } 

    try { 
        var str = obj_ScriptableIO.read(obj_File.fileSize-1); 
    } catch (e) { 
        dump(e); 
    } 
    obj_ScriptableIO.close(); 
    obj_InputStream.close(); 
    return str;
}

var d_doc;
var d_httpreq;
var d_oldContent;
function displayDiffs(title, url, oldContent)
{ 
    d_oldContent = oldContent;
    var win = getTopWin();
    d_doc = win.content.document

    d_doc.writeln("<base href='"+url+"'>");
    d_doc.writeln("<table bgcolor=#e5e5ff color=#ffffff cellpadding=5 width=100%>");
    d_doc.writeln("<td><img src='chrome://updatescan/skin/updatescan_big.png'></td>");
    d_doc.writeln("<td><font face='verdana' color=black size=-1>");
    d_doc.writeln("The page below (<b>"+title+"</b>) has changed since the last scan.");
    d_doc.writeln("The changes are <b style='color:black;background-color:#ffff66'>highlighted</b>.");
    d_doc.writeln("</font></td>");
    d_doc.writeln("<td><font face='verdana' color=black size=-1>");
    d_doc.writeln("<a href='"+url+"'><font color=blue>[Remove&nbsp;highlighting]</font></a>");
    d_doc.writeln("</font></td></table>");
    d_doc.writeln("<hr>");

    d_httpreq = new XMLHttpRequest();
    d_httpreq.open("GET", url);
    d_httpreq.onreadystatechange=displayDiffs_callback;
    displayDiffs_callback();
    d_httpreq.send(null);
}

function displayDiffs_callback()
{
    if (d_httpreq == null || d_httpreq.readyState != 4 || d_httpreq.status != 200) 
        return;

    var string0 = d_oldContent;
    var string1 = d_httpreq.responseText;

    string0 = stripScript(string0);
    string1 = stripScript(string1);

    myDump(string0);
    myDump(string1);

    var htmlText = WDiffString(string0, string1);

    d_doc.writeln(htmlText);
    d_doc.close();
    d_httpreq = null;
}
