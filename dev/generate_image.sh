#!/bin/sh
rm -r tmp
mkdir -p tmp/jqhm


cp jqhm/hmscript.cgi tmp/jqhm/hmscript.cgi
cp dev/update_script tmp/
cp dev/jqhomematic tmp/

cd tmp
tar -czvf ../jqhomematic.tar.gz *
