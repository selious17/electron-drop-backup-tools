var util = require('util');
var fs = require('fs');
var path = require('path');
var remote = require('remote');
var dialog = remote.require('dialog');
var browserWindow = remote.require('browser-window');

function copyFile(files) {

    var i;

    var filePath;
    var fileName;

    var resultMessage = '';

    var targetDirName = $('#dirName').val();
    if( targetDirName == '' ){
        $('#myModalTitle').text('ディレクトリを設定してください');
        $('#myModalMain').html('ファイルをドロップする前に、先にディレクトリを設定してください');
        $('#myModal').modal();
        return;
    }

    for( i=0 ; i<files.length ; i++ ) {
        filePath    = files[i].path;
        fileName    = path.basename( filePath );
        if( $('#copyMode').val() == 'copy' ) {
            fs.createReadStream( filePath ).pipe(fs.createWriteStream( targetDirName + '/' + fileName ) );
            resultMessage += '<p>' + filePath + ' -> ' + targetDirName + '/' + fileName + '</p>';
        } else if( $('#copyMode').val() == 'move' ) {
            fs.rename( filePath , targetDirName + '/' + fileName );
            resultMessage += '<p>' + filePath + ' -> ' + targetDirName + '/' + fileName + '</p>';
        }
    }

    if( $('#copyMode').val() == 'copy' ) {
        $('#myModalTitle').text('以下のコピー処理を実行しました');
    } else if( $('#copyMode').val() == 'move' ) {
        $('#myModalTitle').text('以下の移動ー処理を実行しました');
    }
    $('#myModalMain').html( resultMessage );
    $('#myModal').modal();

    return;
}


function dropDir(files) {

    var isDir = fs.statSync( files[0].path ).isDirectory();
    if( isDir ) {
        $('#dirName').val( files[0].path );
    } else {
        $('#debugArea').text("");
        $('#myModalTitle').text('ディレクトリではありません');
        $('#myModalMain').html('ドロップした対象は、ディレクトリではありません。ディレクトリをドロップまたはダイアログで指定してください');
        $('#myModal').modal();
        return;
    }

}

function setDirName(jInputEle){
    var win = browserWindow.getFocusedWindow();

    dialog.showOpenDialog(
        win,
        // どんなダイアログを出すかを指定するプロパティ
        {
            properties: ['openDirectory'],
        },
        // [ファイル選択]ダイアログが閉じられた後のコールバック関数
        function (dirname) {
            if (dirname) {
                jInputEle.val(dirname);
            }
        });
}
