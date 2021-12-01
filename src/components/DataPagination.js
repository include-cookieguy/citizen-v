import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useSortData from "../hooks/useSortData";

const DataPagination = () => {
  const { auth, citizen } = useSelector((state) => state);

  const [posts, setPosts] = useState([]);
  const [postPerPage, setPostPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  //Sorting
  const { items, requestSort, sortConfig } = useSortData(posts);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const [pageItem, setPageItem] = useState({
    start: 0,
    end: postPerPage,
  });

  const onPageChangeEvent = (start, end) => {
    setPageItem({
      start: start,
      end: end,
    });
  };

  // const OnPerPostChangeEvent = (e) => {
  //     setPostPerPage(e.target.value);
  //     setCurrentPage(1);
  // }

  const numOfPages = Math.ceil(posts.length / postPerPage);
  // console.log(numOfPages);

  const numOfButtons = [];
  for (let i = 1; i <= numOfPages; i++) {
    numOfButtons.push(i);
  }

  const prevPageClick = () => {
    if (currentPage === 1) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPageClick = () => {
    if (currentPage === numOfButtons.length) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

  useEffect(() => {
    if (citizen.searchCitizensList) setPosts(citizen.searchCitizensList);
  }, [citizen.searchCitizensList]);

  useEffect(() => {
    let tempNumberOfButtons = [...arrOfCurrButtons];

    let dotsInitial = "...";
    let dotsLeft = "... ";
    let dotsRight = " ...";

    if (numOfButtons.length < 6) {
      tempNumberOfButtons = numOfButtons;
    } else if (currentPage >= 1 && currentPage <= 3) {
      tempNumberOfButtons = [1, 2, 3, 4, dotsInitial, numOfButtons.length];
    } else if (currentPage === 4) {
      const sliced = numOfButtons.slice(0, 5);
      tempNumberOfButtons = [...sliced, dotsInitial, numOfButtons.length];
    } else if (currentPage > 4 && currentPage < numOfButtons.length - 2) {
      // from 5 to 8 -> (10 - 2)
      const sliced1 = numOfButtons.slice(currentPage - 2, currentPage);
      // sliced1 (5-2, 5) -> [4,5]
      const sliced2 = numOfButtons.slice(currentPage, currentPage + 1);
      // sliced1 (5, 5+1) -> [6]
      tempNumberOfButtons = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        numOfButtons.length,
      ];
      // [1, '...', 4, 5, 6, '...', 10]
    } else if (currentPage > numOfButtons.length - 3) {
      // > 7
      const sliced = numOfButtons.slice(numOfButtons.length - 4);
      // slice(10-4)
      tempNumberOfButtons = [1, dotsLeft, ...sliced];
    } else if (currentPage === dotsInitial) {
      // [1, 2, 3, 4, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 4 + 1 = 5
      // or
      // [1, 2, 3, 4, 5, "...", 10].length = 7 - 3 = 4
      // [1, 2, 3, 4, 5, "...", 10][4] = 5 + 1 = 6
      setCurrentPage(arrOfCurrButtons[arrOfCurrButtons.length - 3] + 1);
    } else if (currentPage === dotsRight) {
      setCurrentPage(arrOfCurrButtons[3] + 2);
    } else if (currentPage === dotsLeft) {
      setCurrentPage(arrOfCurrButtons[3] - 2);
    }

    setArrOfCurrButtons(tempNumberOfButtons);
    const value = currentPage * postPerPage;

    onPageChangeEvent(value - postPerPage, value);
  }, [currentPage, postPerPage, numOfPages]);

  return (
    <>
      <div className="container-fluid mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-text-small mb-0">
                    <thead className="thead-primary table-sorting">
                      <tr>
                        <th>STT</th>
                        <th
                          onClick={() => requestSort("fullName")}
                          className={getClassNamesFor("fullName")}
                        >
                          Họ tên
                        </th>
                        <th>Ngày sinh</th>
                        <th>Địa chỉ hiện tại</th>
                        <th>Tỉnh/Thành phố</th>
                        <th>Quận/Huyện</th>
                        <th>Xã/Phường</th>
                        <th>Giới tính</th>
                        <th>Số điện thoại</th>
                        <th>Căn cước công dân/Chứng minh thư</th>
                        <th>Nghề nghiệp</th>
                        <th>Dân tộc</th>
                        <th>Tôn giáo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items
                        .slice(pageItem.start, pageItem.end)
                        .map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data.fullName}</td>
                              <td>{data.dateOfBirth}</td>
                              <td>{data.currentAddress}</td>
                              <td>{data.location.city}</td>
                              <td>{data.location.district}</td>
                              <td>{data.location.ward}</td>
                              <td>{data.gender}</td>
                              <td>{data.phoneNumber}</td>
                              <td>{data.identifiedCode}</td>
                              <td>{data.occupation}</td>
                              <td>{data.ethnic}</td>
                              <td>{data.religion}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="table-filter-info">
                  <div className="dt-pagination">
                    <ul className="dt-pagination-ul">
                      <li
                        className={`dt-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <a className="dt-link" onClick={prevPageClick}>
                          Prev
                        </a>
                      </li>
                      {arrOfCurrButtons.map((data, index) => {
                        return (
                          <li
                            key={index}
                            className={`dt-item ${
                              currentPage === data ? "active" : ""
                            }`}
                          >
                            <a
                              className="dt-link"
                              onClick={() => setCurrentPage(data)}
                            >
                              {data}
                            </a>
                          </li>
                        );
                      })}
                      <li
                        className={`dt-item ${
                          currentPage === numOfButtons.length ? "disabled" : ""
                        }`}
                      >
                        <a className="dt-link" onClick={nextPageClick}>
                          Next
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataPagination;
