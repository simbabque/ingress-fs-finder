#!/usr/bin/env perl

use strict;
use warnings;

use CHI;
use DateTime;
use Geo::GeoNames;
use Geo::Location::TimeZone;
use List::Util 'first';
use Mojo::DOM;
use Mojo::File;
use Mojo::JSON 'encode_json';
use Mojo::UserAgent;

my $ua  = Mojo::UserAgent->new;
my $glt = Geo::Location::TimeZone->new;
my $geo = Geo::GeoNames->new( username => $ENV{GEO_USERNAME}, ua => $ua );
my $cache =
  CHI->new( driver => 'File', root_dir => $ENV{GEO_CACHE_DIR} || 'cache' );

my %months = (
    January   => 1,
    February  => 2,
    March     => 3,
    April     => 4,
    May       => 5,
    June      => 6,
    July      => 7,
    August    => 8,
    September => 9,
    October   => 10,
    November  => 11,
    December  => 12,
);

# my $sheet_url =
# 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTKIKmwVHSlXLsJvpTebyACxqIK0hN_f23TtUdgbMbO3NANDu8l0AcVKaapk1WSkjnLwU41_8w-7qw/pubhtml?gid=351983111&single=true&headers=false&widget=false&chrome=false';

my $sheet_url =
  $ua->get('https://fevgames.net/ifs-reg/')
  ->result->dom->find('.body-content iframe.none[src*=docs]')
  ->first->attr('src');
my $sheet_dom = $ua->get($sheet_url)->result->dom;

# find the date of the FS
my $pattern = join '|', keys %months;
my ( $month, $year ) =
  $sheet_dom->at('tr td')->all_text =~ m/($pattern) (\d{4}) FS/i;

# create a DT we can reuse later
my $first_saturday_dt = DateTime->new(
    year  => $year,
    month => $months{$month},
    day   => 1,
);
$first_saturday_dt->add( days => ( 6 - $first_saturday_dt->day_of_week ) % 7 );

my ( @events, @fail );
foreach
  my $tr ( $sheet_dom->find('tr')->tail(-2)->grep( sub { $_->at('a') } )->each )
{
    my $cols = $tr->children('td')->to_array;

    my $location = $cols->[0]->all_text;
    my $link = $cols->[0]->at('a')->attr('href') =~ s/%3D/=/r =~ m/q=(.+?)&/;
    my $time = $cols->[1]->text;
    my ( $lat, $lon ) =
      $cols->[2]->at('a')->attr('href') =~ m/ll%3D([-0-9.]+),([-0-9.]+)/;

    # try the chache first,
    # then looking up remotely with Geo::GeoNames,
    # then locally with likely outdated sources with Geo::Location::TimeZone
    my $timezone = eval {
        $cache->get($location)
          || (
            first { exists $_->{timezone} }
            @{ $geo->search( q => $location, style => 'FULL' ) }
        )->{timezone}->{content}
          || $glt->lookup( lat => $lat, lon => $lon );
    };

    unless ($timezone) {
        push @fail,
          {
            location   => $location,
            link       => $link,
            lat        => $lat,
            lon        => $lon,
            time_local => $time,
          };
        next;
    }

    $cache->set( $location, $timezone );

    # convert time to 24h format
    my ( $hour, $minute, $am_pm ) = $time =~ m/(..):(..) (am|pm)/;
    $hour = 0 if $hour == 12;
    $hour += 12 if $am_pm eq 'pm';

    # create a datetime for this event in the right timezone
    my $dt = $first_saturday_dt->clone->set( hour => $hour, minute => $minute )
      ->set_time_zone($timezone);

    push @events,
      {
        location       => $location,
        link           => $link,
        lat            => $lat,
        lon            => $lon,
        time_local     => $time,
        timezone       => $timezone,
        datetime_local => $dt->rfc3339,
      };
}

Mojo::File->new('events.json')
  ->spurt( encode_json( { events => \@events }, { fail => \@fail } ) );
