import json


url = "/Users/raoullieben/Documents/Psychobiologie/minorprogrammeren/datavis/homework3/KNMI_20171131.txt"



def jsonify_file(url):

	# open file
	infile = open(url, 'r')
	data = infile.read()

	# split data at lines
	datasplit = data.splitlines()

	# create empty list for dictionaries
	dicts = []

	for line in range(len(datasplit)):

		# removes header of KNMI files
		if (line > 11 and line < 42):

			# split lines at commas
			tmp = datasplit[line].split(',')

			# append date and rain in dict and store in list
			dicts.append({'date' : tmp[1], 'rain' : tmp[2].strip()})

	# place data in variable
	jsondicts = json.dumps(dicts)

	# load the data into the variable
	jsonified = json.loads(jsondicts)

	# write data to output file
	with open('jsonified.json', 'w') as outfile:
		json.dump(jsonified, outfile)



jsonify_file(url)
