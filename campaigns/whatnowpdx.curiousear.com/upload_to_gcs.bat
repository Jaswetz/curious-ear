call gsutil -m rm gs://whatnowpdx.curiousear.com/**
call gsutil -m cp -c -r . gs://whatnowpdx.curiousear.com
call gsutil rm gs://whatnowpdx.curiousear.com/dev_server.bat
call gsutil rm gs://whatnowpdx.curiousear.com/upload_to_gcs.bat
