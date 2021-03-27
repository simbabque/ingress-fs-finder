#!/usr/bin/env perl

use strict;
use warnings;

use DateTime;
use DateTime::Format::Strptime;
use Mojo::File;
use Mojo::JSON 'encode_json';

my @timezones = qw(
  America/Campo_Grande
  America/Chicago
  America/New_York
  America/Merida
  America/Santo_Domingo
  America/Sao_Paulo
  Asia/Kuala_Lumpur
  Asia/Kolkata
  Australia/Melbourne
  Asia/Tokyo
  Europe/Budapest
  Europe/London
  Europe/Oslo
  Pacific/Auckland
);

my @events;
foreach my $hour ( 0 .. 23 ) {
    for ( 1 .. 2 ) {
        my $tz = $timezones[ int rand @timezones ];
        my $dt = DateTime->today->set_time_zone($tz)->set_hour($hour);

        push @events, {    # apparently vscode can't highlight y{}{}
            location       => ( $tz =~ y!/!!r =~ s/_/, /r ),
            link           => 'https://example.og/',
            lat            => 1,
            lon            => 1,
            time_local     => $dt->datetime,
            timezone       => $tz,
            datetime_local => $dt->rfc3339,
        };
    }
}

my $today = DateTime->today;
Mojo::File->new('events.json')->spurt(
    encode_json(
        {
            events => \@events,
            month  => DateTime::Format::Strptime->new(
                pattern => '%B',
                locale  => 'en_UK'
            )->format_datetime($today),
            year => $today->year,
            fail => []
        }
    )
);
