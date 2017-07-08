call gsutil -m rm gs://yebw.curiousear.com/**
call gsutil -m cp -c -r . gs://yebw.curiousear.com
call gsutil rm gs://yebw.curiousear.com/dev_server.bat
call gsutil rm gs://yebw.curiousear.com/upload_to_gcs.bat
