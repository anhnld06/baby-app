library(anthro)
library(jsonlite)

number_or_na <- function(value) {
  if (is.null(value) || length(value) == 0) NA_real_ else as.numeric(value)
}

text_or_na <- function(value) {
  if (is.null(value) || length(value) == 0) NA_character_ else as.character(value)
}

json_number <- function(value) {
  if (length(value) == 0 || is.na(value) || !is.finite(value)) NULL else unname(value)
}

#* Health check
#* @get /health
function() {
  list(ok = TRUE, engineVersion = as.character(packageVersion("anthro")))
}

#* Calculate WHO Child Growth Standards z-scores for one measurement
#* @post /assess
#* @serializer unboxedJSON
function(req, res) {
  expected_token <- Sys.getenv("WHO_ANTHRO_TOKEN")
  authorization <- req$HTTP_AUTHORIZATION
  if (is.null(authorization)) authorization <- ""
  provided_token <- sub("^Bearer\\s+", "", authorization)
  if (expected_token == "" || provided_token != expected_token) {
    res$status <- 401
    return(list(error = "Unauthorized"))
  }

  body <- fromJSON(req$postBody, simplifyVector = TRUE)
  result <- anthro_zscores(
    sex = as.character(body$sex),
    age = as.numeric(body$ageInDays),
    is_age_in_month = FALSE,
    weight = number_or_na(body$weightKg),
    lenhei = number_or_na(body$lengthHeightCm),
    measure = text_or_na(body$measure),
    headc = number_or_na(body$headCircumferenceCm)
  )

  flag_columns <- c(
    flen = "HEIGHT_AGE_IMPLAUSIBLE",
    fwei = "WEIGHT_AGE_IMPLAUSIBLE",
    fwfl = "WEIGHT_HEIGHT_IMPLAUSIBLE",
    fbmi = "BMI_AGE_IMPLAUSIBLE",
    fhc = "HEAD_AGE_IMPLAUSIBLE",
    c9mo_flag = "MEASUREMENT_POSITION_IMPLAUSIBLE"
  )
  flags <- unname(flag_columns[vapply(
    names(flag_columns),
    function(column) !is.null(result[[column]]) && !is.na(result[[column]][1]) && result[[column]][1] == 1,
    logical(1)
  )])

  list(
    standard = "WHO_2006",
    engineVersion = as.character(packageVersion("anthro")),
    weightAgeZ = json_number(result$zwei[1]),
    heightAgeZ = json_number(result$zlen[1]),
    weightHeightZ = json_number(result$zwfl[1]),
    bmiAgeZ = json_number(result$zbmi[1]),
    headAgeZ = json_number(result$zhc[1]),
    flags = flags
  )
}
