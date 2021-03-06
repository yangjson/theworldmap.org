package net.bandoviet.place;

/**
 * List of POI types.
 * @author quocanh
 *
 */
public enum PlaceType {
  PERSONAL("home.navbar.friendsmap"),
  EVENT("home.navbar.event"),
  NEWS("home.navbar.news"),
  RESTAURANT("home.navbar.restaurant"),
  ADMINISTRATION("home.navbar.administration"),
  COMPANY("home.navbar.company"),
  ASSOCIATION("home.navbar.association"),
  SPORT("home.navbar.sport"),
  EDUCATION("education"),
  HEALTHCARE("healthcare"),
  MARKET("home.navbar.market"),
  SERVICE("home.navbar.service"),
  TOURISM("home.navbar.tourism"),
  RELIGION("home.navbar.religion"),
  ANNOUCEMENT("home.navbar.annoucement"),
  INDIVIDUAL("home.navbar.individual"),
  COUNTRY("home.navbar.countries"),
  USEFULINFO("home.navbar.usefulinfo");
  
  private final String code;
  
  private PlaceType(String code) {
    this.code = code;
  }

  /**
   * Return code.
   * @return the label
   */
  public String getCode() {
    return code;
  }
}
