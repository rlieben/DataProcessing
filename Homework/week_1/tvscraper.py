#!/usr/bin/env python
# Name: Raoul  Lieben
# Student number: 10556346
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''

import csv
import sys
import os


from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    # create empty array for tvseries info
    tvseries = []

    # iterate over each tvserie element
    for tvserie in dom.by_tag("div.lister-item-content"):

        for h3 in tvserie.by_tag("h3.lister-item-header"):

            for a in h3.by_tag("a."):

                
                if a.content != None:

                    title = plaintext(a.content.encode("utf-8"))
                    tvseries.append(title)

                else:

                    tvseries.append("missing")
            

        # get rating of tvserie
        for div in tvserie.by_tag("div.inline-block ratings-imdb-rating"):

            if div.content != None:

                tvseries.append(plaintext(div.content.encode("utf-8")))

            else:

                tvseries.append("missing")
            

        # get genres of tvserie
        for span in tvserie.by_tag("span.genre"):

            if span.content != None:

                tvseries.append(plaintext(span.content.encode("utf-8")))

            else:

                tvseries.append("missing")
            

        # get actors of tvserie
        for p in tvserie.by_tag("p."):

            if p.by_tag("a."):
               
                players = ""
                for a in p.by_tag("a."):

                    if a != None:

                        players = players + plaintext(a.content)
                        players = players + ", "
                        players.encode("utf-8")
                                 
                    else:

                        players = players + "missing"

                players.encode("utf-8")
                tvseries.append(players)

                
                

        # get runtime of tvserie
        for span in tvserie.by_tag("span.runtime"):

            if span.content != None:

                tvseries.append(plaintext(span.content.encode("utf-8")))

            else:

                tvseries.append("missing")

    # return list with tvseries info
    return tvseries

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''

    # because of the UNICODE characters, the file stops writing when it encounters one.
    # as was stated in the assignment, i ignored these characters and therefore i am aware of the problem
    # that it doesnt write all tvseries into th csv file.


    # initiatie csv file
    writer = csv.writer(f)

    # write top row
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # iterate over each row and cell and write corresponding value
    for i in range(0, len(tvseries), 5):
        
        title = tvseries[i]
        rating = tvseries[i+1]
        genre = tvseries[i+2]
        actors = tvseries[i+3]
        runtime = tvseries[i+4]

        writer.writerow([title, rating, genre, actors, runtime])
        

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)