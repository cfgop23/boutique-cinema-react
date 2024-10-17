import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMovieById } from "../../api/movie/movieApi";
import {
  adultPrice,
  calculateTotalPrice,
  generateReservationNumber,
  specialPrice,
  teenPrice,
} from "../../util/reservationUtil";
import { createReservation } from "../../api/reservationApi";

export default function ReservationResult({
  adultCount,
  teenCount,
  specialCount,
  selectedSeats,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState({});
  const [roundTime, setRoundTime] = useState("");
  const { movieNum, date, theaterNum, roundNum } = location.state || {};

  const totalCount = adultCount + teenCount + specialCount;

  useEffect(() => {
    if (!movieNum) return;

    const loadMovie = async () => {
      const data = await fetchMovieById(movieNum);
      setMovie(data);
    };

    loadMovie();
  }, [movieNum]);

  useEffect(() => {
    const convertRoundToRoundTime = (roundNum) => {
      switch (roundNum) {
        case 1:
          setRoundTime(movie.roundTime1);
          break;
        case 2:
          setRoundTime(movie.roundTime2);
          break;
        case 3:
          setRoundTime(movie.roundTime3);
          break;
        case 4:
          setRoundTime(movie.roundTime4);
          break;
        case 5:
          setRoundTime(movie.roundTime5);
          break;
        default:
          console.error("잘못된 번호입니다.");
      }
    };

    convertRoundToRoundTime(roundNum);
  }, [roundNum, movie]);

  // 이전 화면으로 이동하는 핸들러
  const handleGoBack = () => {
    navigate(-1);
  };

  // 결제 처리 핸들러
  const handlePayment = async (e) => {
    e.preventDefault();

    const rPersonTypes = [
      ...Array(adultCount).fill("성인"),
      ...Array(teenCount).fill("청소년"),
      ...Array(specialCount).fill("우대"),
    ];

    const rPersonPrices = [
      ...Array(adultCount).fill(adultPrice),
      ...Array(teenCount).fill(teenPrice),
      ...Array(specialCount).fill(specialPrice),
    ];

    const reservationData = {
      rNum: generateReservationNumber(movieNum, theaterNum, roundNum),
      reserveDate: date,
      movieNum,
      theaterNum,
      roundNum,
      paymentAmount: parseInt(
        calculateTotalPrice(adultCount, teenCount, specialCount).replace(
          /[^0-9]/g,
          "",
        ),
        10,
      ),
      mId: "qqq123123",
      rPersonType1: rPersonTypes[0],
      rPersonType2: rPersonTypes[1] || null,
      rPersonType3: rPersonTypes[2] || null,
      rPersonType4: rPersonTypes[3] || null,
      rPersonType5: rPersonTypes[4] || null,
      rPersonType6: rPersonTypes[5] || null,
      rPersonPrice1: rPersonPrices[0],
      rPersonPrice2: rPersonPrices[1] || null,
      rPersonPrice3: rPersonPrices[2] || null,
      rPersonPrice4: rPersonPrices[3] || null,
      rPersonPrice5: rPersonPrices[4] || null,
      rPersonPrice6: rPersonPrices[5] || null,
      seatNum1: selectedSeats[0],
      seatNum2: selectedSeats[1] || null,
      seatNum3: selectedSeats[2] || null,
      seatNum4: selectedSeats[3] || null,
      seatNum5: selectedSeats[4] || null,
      seatNum6: selectedSeats[5] || null,
    };

    const result = await createReservation(reservationData);
  };

  return (
    <div className="h-full rounded bg-gray-100 p-4 text-primary">
      {/* 영화 정보 안내 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-white">
          {movie.rating === "전체" ? (
            <div className="flex h-7 w-7 items-center justify-center rounded bg-green-600 font-medium">
              All
            </div>
          ) : movie.rating === "12" ? (
            <div className="flex h-7 w-7 items-center justify-center rounded bg-yellow-500 font-medium">
              12
            </div>
          ) : movie.rating === "15" ? (
            <div className="flex h-7 w-7 items-center justify-center rounded bg-orange-600 font-medium">
              15
            </div>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded bg-red-600 font-medium">
              19
            </div>
          )}
          <span className="text-xl font-medium text-primary">
            {movie.korTitle}
          </span>
        </div>
        <div className="text-gray-600">{movie.genre}</div>
      </div>

      {/* 예매 정보 안내 */}
      <div className="mt-3 border-y border-gray-300 py-3">
        <div>{theaterNum === 0 ? "일반관" : "커플관"}</div>
        <div>{date}</div>
        <div>{`${roundTime} (${roundNum}회차)`}</div>
      </div>
      <div className="flex justify-between border-b border-gray-300 py-3">
        <div className="flex flex-col justify-between">
          {/* 좌석 표시 안내 */}
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-block h-5 w-5 bg-gray-400"></div>
              <span>선택가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-block h-5 w-5 bg-secondary"></div>
              <span>선택</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-block h-5 w-5 bg-tertiary"></div>
              <span>예매완료</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative inline-block h-5 w-5 items-center justify-center bg-gray-400">
                <div className="absolute bottom-[9px] h-[2px] w-full rotate-45 bg-gray-300"></div>
                <div className="absolute bottom-[9px] h-[2px] w-full -rotate-45 bg-gray-300"></div>
              </div>
              <span>선택불가</span>
            </div>
          </div>

          {/* 좌석 가격 안내 */}
          <div className="space-y-1 text-sm leading-none text-gray-600">
            <div>성인 14,000원</div>
            <div>청소년 12,000원</div>
            <div>우대 7,000원</div>
          </div>
        </div>

        {/* 선택좌석 안내 */}
        <div className="mr-2 flex flex-col items-center">
          <span className="mb-2 inline-block">선택좌석</span>
          <div className="grid grid-cols-2 gap-2">
            {/* 선택한 좌석 번호 출력 */}
            {Array.from({ length: 6 }, (_, index) => {
              const seatNumber = selectedSeats[index] || "-"; // 좌석 번호가 없으면 '-'
              return (
                <div
                  key={index}
                  className={`flex h-10 w-10 items-center justify-center rounded ${seatNumber === "-" ? "bg-gray-200" : "bg-secondary text-white"}`}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="py-3">
        <div className="mb-2 flex h-4 text-sm">
          {adultCount > 0 && <p>성인 {adultCount}</p>}
          {adultCount > 0 && teenCount > 0 && " · "}
          {teenCount > 0 && <p>청소년 {teenCount}</p>}
          {(teenCount > 0 || adultCount > 0) && specialCount > 0 && " · "}
          {specialCount > 0 && <p>우대 {specialCount}</p>}
        </div>

        <div className="flex justify-between">
          <div className="font-medium">최종결제금액</div>
          <div className="text-xl font-semibold text-secondary">
            {selectedSeats.length === totalCount
              ? calculateTotalPrice(adultCount, teenCount, specialCount)
              : calculateTotalPrice(0, 0, 0)}
          </div>
        </div>
      </div>
      <div className="flex h-[48px] items-end gap-2 text-lg">
        <button
          onClick={handleGoBack}
          className="w-1/2 rounded bg-tertiary py-2 text-white"
        >
          이전
        </button>
        <button
          onClick={handlePayment}
          disabled={selectedSeats.length !== totalCount || totalCount === 0}
          className={`w-1/2 rounded py-2 text-white ${selectedSeats.length !== totalCount || totalCount === 0 ? "bg-gray-400" : "bg-secondary"}`}
        >
          결제
        </button>
      </div>
    </div>
  );
}
