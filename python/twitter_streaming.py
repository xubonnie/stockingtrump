# imports
import json
from twitter import *

# cred variables
ACCESS_TOKEN = '771826916718288896-CWcYz3ytJDBav7EqwV8vPEWFUfbrazk'
ACCESS_SECRET = 'DPjNY6K5URXybLmtFZkJLkwTvLDLyZUqPntor9ZCKuToE'
CONSUMER_KEY = 'cX31uPxg6i4zsFXBPiOWsoRPr'
CONSUMER_SECRET = '9b4syA9t3Mqt3gouLlp0Sgz5wZdfl6J278A2K1GhfnoAZd5BH6'

t = Twitter(auth=OAuth(ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET));
t.statuses.user_timeline(screen_name="realDonaldTrump")


#
# oauth = OAuth(ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET)
#
# # initiate connection to twitter streaming API
# twitter_stream = TwitterStream(auth=oauth)
#
# # get sample public data
# iterator = twitter_stream.statuses.sample()
#
# # print each tweet in stream to screen
# tweet_count = 5
# for tweet in iterator:
#     tweet_count -= 1
#
#     # convert to json
#     print json.dumps(tweet)
#
#     if tweet_count <= 0:
#         break
