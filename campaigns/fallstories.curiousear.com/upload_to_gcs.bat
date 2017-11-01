call gsutil -m rm gs://fallstories.curiousear.com/**
call gsutil -m cp -c -r . gs://fallstories.curiousear.com
call gsutil rm gs://fallstories.curiousear.com/dev_server.bat
call gsutil rm gs://fallstories.curiousear.com/upload_to_gcs.bat
