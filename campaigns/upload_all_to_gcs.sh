## declare an array variable
declare -a arr=("alder" "blackhistorymonth" "easter2017" "fallstories" "mealsonwheels" "milwaukieartwalk" "ourcannabisfuture" "roosevelthigh" "royalton" "static" "whatnowpdx")

## now loop through the above array
for i in "${arr[@]}"
do
   echo "$i.curiousear.com"
   cd "$i.curiousear.com"
   sh upload_to_gcs.sh
   cd ..
   # or do whatever with individual element of the array
done

# You can access them using echo "${arr[0]}", "${arr[1]}" also
