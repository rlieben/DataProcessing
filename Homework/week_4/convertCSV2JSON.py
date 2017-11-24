import json


url = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_4/API_EG.FEC.RNEW.ZS_DS2_en_csv_v2.csv"
url2 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_4/API_SP.POP.TOTL_DS2_en_csv_v2.csv"
url3 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_4/Metadata_Country_API_EG.FEC.RNEW.ZS_DS2_en_csv_v2.csv"



def jsonify_file(url, url2, url3):

	# open file
	infile = open(url, 'r')
	data = infile.read()

	# open 2nd file
	infile2 = open(url2, 'r')
	data2 = infile2.read()

	#open 3rd file
	infile3 = open(url3,'r')
	data3 = infile3.read()

	# split data at lines
	linessplit = data.splitlines()
	linessplit2 = data2.splitlines()
	linessplit3 = data3.splitlines()


	# empty lists for header removal
	datasplit = []
	datasplit2 = []
	datasplit3 = []

	for line in range(len(linessplit)):
		if (line > 4):

			datasplit.append(linessplit[line])
			datasplit2.append(linessplit2[line])

	for line in range(len(linessplit3)):
		if (line > 0):

			datasplit3.append(linessplit3[line])

	# create empty list for dictionaries
	dicts = []

	for line in range(len(datasplit) - 1):

		# wrong format from world databank
		if (line != 8 and line != 9 and line != 67 and line != 108 ):

			# split lines at commas
			tmp = datasplit[line].split(',')
			tmp2 = datasplit2[line].split(',')
			tmp3 = datasplit3[line].split(',')
			tmp58 = int(float(tmp2[58].strip('\"')))

			if (tmp[0].strip('\"') is not '' and
				tmp[58].strip('\"') is not '' and
				tmp2[58].strip('\"') is not '' and
				tmp3[2].strip('\"') is not ''):

				# filter with countries smaller than 100 mill of data
				if (tmp58 < 100000000):

					# append date and rain in dict and store in list
					dicts.append({'country' : tmp[0].strip('\"'), 'renenerg' : tmp[58].strip('\"'), 'population' : tmp2[58].strip('\"'), 'income' : tmp3[2].strip('\"')})

	print(dicts)
	
	# place data in variable
	jsondicts = json.dumps(dicts)

	# load the data into the variable
	jsonified = json.loads(jsondicts)

	# write data to output file
	with open('jsonified.json', 'w') as outfile:
		json.dump(jsonified, outfile)



jsonify_file(url, url2, url3)
