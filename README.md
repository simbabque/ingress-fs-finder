# IngressFsFinder

This project lists all Ingress First Saturday events for the upcoming month ordered by starting time and shows them in your timezone. 

You can use it [here](https://simbabque.github.io/ingress-fs-finder/).

It is not affiliated with Ingress, Niantic or FevGames. It merely collects data from publicly accessible sources and displays them in a more accessible format.

## Technical details

The website is hosted in Github Pages and gets built entirely on Github Actions workflows. The events are fetched with a scraper written in the Perl programming language, geocoded and enriched with timezone information. The frontend is written in Angular.

Patches and ideas are welcome.