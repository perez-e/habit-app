module HabitsHelper

  def get_freq(freq, my_date)
    month_size = Time.days_in_month(my_date.month, my_date.year)
    month_size < freq ? month_size : freq
  end

  def days_of_week
    ["Su", "M", "Tu", "W", "Th", "F", "Sa"]
  end

  def this_sunday
    Date.today.beginning_of_week - 1
  end

  def is_today(my_date)
    my_date.cwday == Date.today.cwday &&
    my_date.cwyear == Date.today.cwyear
  end

  def show_votes(votes)
    ("(<span class="">#{votes}</span>)").html_safe unless votes.nil?
  end

  def show_date(my_date)
    my_date.strftime("%-m/%e/%y")
  end

end