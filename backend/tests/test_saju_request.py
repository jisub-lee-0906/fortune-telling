import unittest

from pydantic import ValidationError

from app.schemas.saju import SajuRequest


def validate(payload):
    validator = getattr(SajuRequest, "model_validate", SajuRequest.parse_obj)
    return validator(payload)


class SajuRequestValidationTest(unittest.TestCase):
    def test_accepts_valid_leap_day_and_time(self):
        request = validate({"year": 2024, "month": 2, "day": 29, "hour": 23, "minute": 59})

        self.assertEqual((request.year, request.month, request.day), (2024, 2, 29))

    def test_rejects_impossible_calendar_date(self):
        with self.assertRaises(ValidationError):
            validate({"year": 2025, "month": 2, "day": 29, "hour": 12})

    def test_rejects_out_of_range_month_and_day(self):
        for payload in (
            {"year": 2025, "month": 0, "day": 1, "hour": 0},
            {"year": 2025, "month": 13, "day": 1, "hour": 0},
            {"year": 2025, "month": 1, "day": 0, "hour": 0},
            {"year": 2025, "month": 1, "day": 32, "hour": 0},
        ):
            with self.subTest(payload=payload), self.assertRaises(ValidationError):
                validate(payload)

    def test_rejects_out_of_range_time(self):
        for payload in (
            {"year": 2025, "month": 1, "day": 1, "hour": 24, "minute": 0},
            {"year": 2025, "month": 1, "day": 1, "hour": 23, "minute": -1},
            {"year": 2025, "month": 1, "day": 1, "hour": 23, "minute": 60},
        ):
            with self.subTest(payload=payload), self.assertRaises(ValidationError):
                validate(payload)


if __name__ == "__main__":
    unittest.main()
