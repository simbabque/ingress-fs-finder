# IngressFsFinder

This project lists all Ingress First Saturday events for the upcoming month ordered by starting time and shows them in your timezone. 

You can use it [here](https://simbabque.github.io/ingress-fs-finder/).

It is not affiliated with Ingress, Niantic or FevGames. It merely collects data from publicly accessible sources and displays them in a more accessible format.

## Technical details

The website is hosted in Github Pages and gets built entirely on Github Actions workflows. The events are fetched with a scraper written in the Perl programming language, geocoded and enriched with timezone information. The frontend is written in Angular.

## Running locally

To run the Perl backend, you need to first install dependencies. There is a `cpanfile` included that lists the required modules. One way of installing them is to do this:

```
$ cpanm --installdeps .
```

You can generate test data based around the current day. It will include random events in a couple of different timezones. Some will be in the past, others will be in the future.

```
$ perl bin/create_test_data.pl
```

To run the frontend, you need `angular-cli` installed.

```
$ ng serve
```

To run tests, again use the Angular CLI.
```
$ ng test
```

## Using the real parser

To create a list of real events, you need a free account at http://www.geonames.org/. See the documentation of [Geo::GeoNames](https://metacpan.org/pod/Geo::GeoNames) for how to do that.

The parser expects the API username (that's basically their API key) to be present in the `GEO_USERNAME` environment variable.

```
$ GEO_USERNAME=<user> perl bin/parse.pl
```

This process is going to take at least 10 to 15 minutes the first time it is run. This depends a little on when in the month that happens, because the number of events is low early in the month.

Locations will be cached in the `cache` folder unless you chose a different one with the `GEO_CACHE_DIR` environment variable. This makes the process significantly faster.

# Contributing

Patches and ideas are welcome. Pleae open an issue if you have any questions.