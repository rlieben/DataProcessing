import json


url = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Limburg.txt"
url2 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Noord-Holland.txt"
url3 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Zuid-Holland.txt"
url4 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Overijssel.txt"
url5 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Drenthe.txt"
url6 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Groningen.txt"
url7 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Utrecht.txt"
url8 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Brabant.txt"
url9 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Friesland.txt"
url10 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Zeeland.txt"
url11 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Gelderland.txt"
url12 = "/Users/raoullieben/Documents/GitHub/DataProcessing/Homework/week_6/Flevoland.txt"



def jsonify_file(url, url2, url3, url4, url5, url6, url7, url8, url9, url10, url11, url12):

	# open file
	infile = open(url, 'r')
	data = infile.read()

	# split data at lines
	datasplit = data.splitlines()

	# open file
	infile2 = open(url2, 'r')
	data2 = infile2.read()

	# split data at lines
	datasplit2 = data2.splitlines()

	# open file
	infile3 = open(url3, 'r')
	data3 = infile3.read()

	# split data at lines
	datasplit3 = data3.splitlines()

	# open file
	infile4 = open(url4, 'r')
	data4 = infile4.read()

	# split data at lines
	datasplit4 = data4.splitlines()

	# open file
	infile5 = open(url5, 'r')
	data5 = infile5.read()

	# split data at lines
	datasplit5 = data5.splitlines()

	# open file
	infile6 = open(url6, 'r')
	data6 = infile6.read()

	# split data at lines
	datasplit6 = data6.splitlines()

	# open file
	infile7 = open(url7, 'r')
	data7 = infile7.read()

	# split data at lines
	datasplit7 = data7.splitlines()

	# open file
	infile8 = open(url8, 'r')
	data8 = infile8.read()

	# split data at lines
	datasplit8 = data8.splitlines()

	# open file
	infile9 = open(url9, 'r')
	data9 = infile9.read()

	# split data at lines
	datasplit9 = data9.splitlines()

	# open file
	infile10 = open(url10, 'r')
	data10 = infile10.read()

	# split data at lines
	datasplit10 = data10.splitlines()

	# open file
	infile11 = open(url11, 'r')
	data11 = infile11.read()

	# split data at lines
	datasplit11 = data11.splitlines()

	# open file
	infile12 = open(url12, 'r')
	data12 = infile12.read()

	# split data at lines
	datasplit12 = data12.splitlines()

	# create empty list for dictionaries
	dicts = []

	for line in range(len(datasplit)):

		# removes header of KNMI files
		if (line > 13):

			# split lines at commas
			tmp = datasplit[line].split(',')

			tmp2 = datasplit2[line].split(',')

			tmp3 = datasplit3[line].split(',')

			tmp4 = datasplit4[line].split(',')

			tmp5 = datasplit5[line].split(',')

			tmp6 = datasplit6[line].split(',')

			tmp7 = datasplit7[line].split(',')

			tmp8 = datasplit8[line].split(',')

			tmp9 = datasplit9[line].split(',')

			tmp10 = datasplit10[line].split(',')

			tmp11 = datasplit11[line].split(',')

			tmp12 = datasplit12[line].split(',')

			# tmpdate = tmp[1]
			# year = tmpdate[:4]
			# month = tmpdate[4:6]
			# day = tmpdate[6:]
			tmpgem = int(tmp[2]) + 5
			
			# # print(year)
			# # print(day)
			# # print(month)
			# # print(tmp)

			# tmpdate = year + '-' + month + '-' + day

			# # print(tmpdate)
			# print(tmp[1])

			# append date and rain in dict and store in list
			dicts.append({'date' : tmp[1], 'gemhum' : tmp[2], 'province' : 'Limburg'})
			dicts.append({'date' : tmp2[1], 'gemhum' : tmp2[2], 'province' : 'Noord-Holland'})
			dicts.append({'date' : tmp3[1], 'gemhum' : tmp3[2], 'province' : 'Zuid-Holland'})
			dicts.append({'date' : tmp4[1], 'gemhum' : tmp4[2], 'province' : 'Overijssel'})
			dicts.append({'date' : tmp5[1], 'gemhum' : tmp5[2], 'province' : 'Drenthe'})
			dicts.append({'date' : tmp6[1], 'gemhum' : tmp6[2], 'province' : 'Groningen'})
			dicts.append({'date' : tmp7[1], 'gemhum' : tmp7[2], 'province' : 'Utrecht'})
			dicts.append({'date' : tmp8[1], 'gemhum' : tmp8[2], 'province' : 'Brabant'})
			dicts.append({'date' : tmp9[1], 'gemhum' : tmp9[2], 'province' : 'Friesland'})
			dicts.append({'date' : tmp10[1], 'gemhum' : tmp10[2], 'province' : 'Zeeland'})
			dicts.append({'date' : tmp11[1], 'gemhum' : tmp11[2], 'province' : 'Gelderland'})
			dicts.append({'date' : tmp12[1], 'gemhum' : tmp12[2], 'province' : 'Flevoland'})


	print (dicts)
	# place data in variable
	jsondicts = json.dumps(dicts)

	# load the data into the variable
	jsonified = json.loads(jsondicts)

	# write data to output file
	with open('jsonified.json', 'w') as outfile:
		json.dump(jsonified, outfile)



jsonify_file(url, url2, url3, url4, url5, url6, url7, url8, url9, url10, url11, url12)
