import React from "react";

export function FirstPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        How is Disadvantage Experienced and Described in the Australian Context?
      </div>
      <div className="mt-[3%]">
        We've re-imagined a{" "}
        <span className="text-yellow-400">'communication network'</span> to
        highlight a broad picture of those disadvantaged groups and associated
        issues being discussed in the news recently, and which groups and issues
        are being ignored.{" "}
        <span className="text-yellow-400">'Discourse of the present'</span> is a{" "}
        <span className="text-yellow-400">'living'</span> platform; it shows
        what's being discussed in the news right now! Click below to progress
        through the quick start guide, or click on{" "}
        <span className="text-yellow-400">( i )</span> to come back to this
        page:
        <br></br>
        <br></br>
        <ol className="list-decimal list-inside">
          <li>
            <span className="text-yellow-400">Australian news articles</span>{" "}
            are key to out visualisation. Articles on similar topics & published
            around the same time, are grouped as a set of overlapping
            rectangles, called{" "}
            <span className="text-yellow-400">'stations'</span>.
          </li>
          <li>
            Over time, the groups of articles can be connected and form a
            <span className="text-yellow-400">
              {" "}
              'multi lenses story' on a particular topic
            </span>
            , represented by
            <span className="text-yellow-400"> connecting lines</span> between
            stations. The strenght of the relationship between two stations is
            illustrated by colour, with yellow being the strongest.
          </li>
          <li>
            <span className="text-yellow-400">Multiple topics</span> can be
            discussed over the same period; narratives can{" "}
            <span className="text-yellow-400">merge</span> in a particular
            collection of articles or can{" "}
            <span className="text-yellow-400">split </span>
            into new ones.
          </li>
          <li>
            Discover two of the eight 'communication networks' we organised for
            you. They focus on{" "}
            <span className="text-yellow-400">
              disadvantage issues that tend to co-occur
            </span>
            .
          </li>
        </ol>
      </div>
      <div className="mt-[3%] mb-[3%]"></div>
    </>
  );
}

export function ArticlePage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        Australian News Articles are Key to Our Visualisation
      </div>
      <div className="mt-[3%]">
        News articles represent the fundamental unit of the discourse of
        opportunity and disadvantage in Australia. The articles collected are
        from new publications. Each article is titled, authored and dated.
        Tracking the content of news articles allows us{" "}
        <span className="text-yellow-400">
          to map out how various topics are being discussed.
        </span>
        <br></br>
        <br></br>
        Looking at the bigger picture, we can see how frequently certain topics
        are featured in the news. News articles on similar topics that are
        published around the same time are grouped together in our visualisation
        as{" "}
        <span className="text-yellow-400">a set of overlapping rectangles</span>
        , which we call a <span className="text-yellow-400">'station'</span>.
        The number of articles in a station is indicated by the size of the
        stack of rectangles and by the number encircled beneath the station.
        Each station is labelled by its most representative news headline and by
        its most prominent keyword.
        <br></br>
        <br></br>A single article can highlight various disadvantage issues, and
        some issues are more common than others.
      </div>
    </>
  );
}

export function MetroStopPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        Groups of Articles can be Related to One Another
      </div>
      <div className="mt-[3%]">
        When connected together, they can form a{" "}
        <span className="text-yellow-400">'multi lenses story'</span> about a
        particular social issues.
        <br></br>
        <br></br>
        Over time, we end up with various collections of published news
        articles, or stations. Two stations sharing a similar topic{" "}
        <span className="text-yellow-400">
          can be linked by a connecting line
        </span>
        . These connections are labeled using the most common link or topic
        between the two stations.
        <br></br>
        <br></br>
        Depending on the frequency of the shared keywords or the number of
        unique shared keywords, we can start to make assumptions about the{" "}
        <span className="text-yellow-400">strength</span> of the relationship
        between two stations. The strength is illustrated by colour; purple on
        the weak end of the spectrum or yellow on the strong end.
        <br></br>
        <br></br>
        Stations don't just have one single connection, they can be{" "}
        <span className="text-yellow-400">
          connected to many other stations
        </span>
        . This means that interesting structures can emerge from these
        connections.
      </div>
    </>
  );
}

export function MetroLinesPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">
        Multiple Topics are Discussed Over the Same Period of Time
      </div>
      <div className="mt-[3%]">
        The stations (and the articles they represent) don't all exist at the
        same time, and are each associated with a{" "}
        <span className="text-yellow-400">specific time period</span>. The
        connection lines are therefore drawn to indicate how a topic has been
        discussed over time in recent media. For example: on the top line, we
        can see that the topic has been less frequently discussed recently,
        since most of that line's articles are further back in time, on the left
        end of the line.
        <br></br>
        <br></br>
        Each entire line can be seen as a specific topic or event, and its
        discussion over time is summarised by keywords labelling each connection
        between stations. Multiple topic lines mean multiple stories. The{" "}
        <span className="text-yellow-400">
          topic lines running in parallel{" "}
        </span>
        represent narratives that exist over the same time period. But what
        happens when narratives intersect or branch to form new discussions?
        <br></br>
        <br></br>
        <ul className="list-disc list-inside">
          <li>
            When <span className="text-yellow-400">narratives merge</span> in a
            particular collection of articles, so do their topic lines.
          </li>
          <li>
            When <span className="text-yellow-400">narratives split</span>,
            their topic line splits to form two new topic lines with groups of
            articles that each discuss the newly separate narratives.
          </li>
        </ul>
        <br></br>
        The connection lines paint us a quite literal{" "}
        <span className="text-yellow-400">
          picture of what the discourse looks like.
        </span>
      </div>
    </>
  );
}

export function FinalPage() {
  return (
    <>
      <div className="text-[2.5rem] font-bold">What to Focus on?</div>
      <div className="mt-[3%]">
        The discourse of equity, opportunity, and disadvantage is complex and
        multidimensional. It has many intersecting elements that can be viewed
        through a multitude of lenses.{" "}
        <span className="text-yellow-400">Some issues are more common</span>{" "}
        than others (e.g. violence, addiction), and{" "}
        <span className="text-yellow-400">some tend to co-occur</span>, like the
        eight groups listed below.
        <br></br>
        <br></br>
        <ol className="list-decimal list-inside">
          <li>Voice, Segregation, Prejudice & Discrimination, Human Rights</li>
          <li>Work, Finance, Family, Government Assistance</li>
          <li>Equity, Fairness</li>
          <li>Poverty, Shelter</li>
          <li>General Disadvantage, Education</li>
          <li>Criminal Justice, Addiction, Child Protection, Violence</li>
          <li>Vulnerable, Negative Emotions</li>
          <li>Health, Food & Nutrition</li>
        </ol>
        <br></br>
        Click the <span className="text-yellow-400">back arrow</span> in the
        bottom right to go back to the landing page and browse through all the
        available representations of equity, opportunity and disadvantage in
        recent news.
      </div>
    </>
  );
}
